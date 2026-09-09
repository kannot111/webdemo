'use client';

import { useEffect, useRef } from 'react';
import styles from './GraphVisualizer.module.css';

/**
 * Renderer đồ thị/cây dùng thư viện cytoscape (open-source, MIT) — KHÔNG tự
 * vẽ toạ độ: cytoscape lo toàn bộ render, layout ('cose' — lực đẩy) và tương
 * tác. Component chỉ truyền dữ liệu nodes/edges từ step vào thư viện.
 *
 * Bước đầu tiên phải có { graph: { nodes: [id], edges: [{ u, v, w? }], directed? } }.
 * Mỗi bước tiếp theo có thể kèm:
 *   - keys:  [nodeId]  → đỉnh đang được tác động (tô đậm)
 *   - edges: [[u, v]]  → cạnh đang được tác động (tô đậm)
 *   - values:{ id: 'nhãn phụ' } → nhãn bổ sung (khoảng cách, dp...).
 */
export default function GraphVisualizer({ steps = [], current = 0, height = 320 }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const graphSigRef = useRef('');
  const roRef = useRef(null);
  const currentRef = useRef(current);
  currentRef.current = current;

  // Khởi tạo cytoscape MỘT LẦN với bộ style — element được nạp trong apply()
  // (lúc mount steps còn rỗng nên phải chờ generator đẩy bước đầu tiên).
  useEffect(() => {
    let disposed = false;
    let cy;
    (async () => {
      const cytoscape = (await import('cytoscape')).default;
      if (disposed || !containerRef.current) return;
      cy = cytoscape({
        container: containerRef.current,
        elements: [],
        layout: { name: 'cose', animate: false, padding: 24, nodeOverlap: 12 },
        style: [
          {
            selector: 'node',
            style: {
              label: 'data(label)',
              'text-valign': 'center',
              'text-halign': 'center',
              'background-color': '#e8eef7',
              'border-color': '#1e56a0',
              'border-width': 2,
              width: 34,
              height: 34,
              'font-size': 12,
              'font-family': 'Cascadia Mono, Consolas, monospace',
              color: '#20262e',
              'text-wrap': 'wrap',
            },
          },
          {
            selector: 'node.hit',
            style: { 'background-color': '#1e56a0', color: '#ffffff' },
          },
          {
            selector: 'edge',
            style: {
              width: 2,
              'line-color': '#b7c0cb',
              'target-arrow-color': '#b7c0cb',
              'arrow-scale': 1.1,
              label: 'data(label)',
              'font-size': 11,
              'font-family': 'Cascadia Mono, Consolas, monospace',
              color: '#5b6572',
              'text-background-color': '#ffffff',
              'text-background-opacity': 1,
              'text-background-padding': 2,
              'curve-style': 'bezier',
            },
          },
          {
            selector: 'edge.hit',
            style: { width: 4, 'line-color': '#1e56a0', 'target-arrow-color': '#1e56a0', color: '#1e56a0' },
          },
        ],
      });
      cyRef.current = cy;
      apply();
      // Đảm bảo render đúng khi khung thay đổi kích thước sau khi mount.
      const ro = new ResizeObserver(() => cy.resize());
      ro.observe(containerRef.current);
      roRef.current = ro;
    })();
    return () => {
      disposed = true;
      roRef.current?.disconnect();
      cy?.destroy();
      cyRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Áp dụng highlight của bước hiện tại (chạy lại mỗi khi bước đổi).
  useEffect(() => {
    apply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, steps.length]);

  function apply() {
    const cy = cyRef.current;
    if (!cy) return;
    const step = steps[currentRef.current];

    // Đồng bộ element khi đồ thị xuất hiện trong steps (lúc mount steps rỗng)
    // hoặc đổi sang generator/graph khác.
    const graph = steps[0]?.graph;
    const sig = graph
      ? `${graph.nodes.join(',')}|${graph.edges.map((e) => `${e.u}>${e.v}`).join(',')}`
      : '';
    if (sig !== graphSigRef.current) {
      graphSigRef.current = sig;
      cy.elements().remove();
      if (graph) {
        cy.add(graph.nodes.map((id) => ({ group: 'nodes', data: { id, label: id } })));
        cy.add(
          graph.edges.map((e, i) => ({
            group: 'edges',
            data: { id: `e${i}`, source: e.u, target: e.v, label: e.w != null ? String(e.w) : '' },
          })),
        );
        cy.edges().style({ 'target-arrow-shape': graph.directed ? 'triangle' : 'none' });
        cy.layout({ name: 'cose', animate: false, padding: 24, nodeOverlap: 12 }).run();
        cy.fit(undefined, 30);
      }
    }

    const hitNodes = new Set(step?.keys ?? []);
    const hitEdges = new Set((step?.edges ?? []).map(([u, v]) => `${u}|${v}`));

    cy.nodes().forEach((n) => {
      const id = n.id();
      n.classes(hitNodes.has(id) ? 'hit' : '');
      const extra = step?.values?.[id];
      n.data('label', extra != null ? `${id}\n${extra}` : id);
    });
    cy.edges().forEach((e) => {
      const u = e.source().id();
      const v = e.target().id();
      e.classes(hitEdges.has(`${u}|${v}`) || hitEdges.has(`${v}|${u}`) ? 'hit' : '');
    });
  }

  return (
    <div className={styles.frame} style={{ height }}>
      <div ref={containerRef} className={styles.canvas} />
    </div>
  );
}