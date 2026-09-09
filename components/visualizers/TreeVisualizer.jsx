'use client';

import { useEffect, useRef } from 'react';
import styles from './GraphVisualizer.module.css';

/**
 * TreeVisualizer — vẽ CÂY bằng thư viện cytoscape với layout 'breadthfirst'
 * (cây phân tầng từ gốc xuống), KHÔNG tự tính toạ độ tay.
 *
 * Dùng cho: cây đệ quy/quay lui (cây không gian trạng thái), QHD trên cây,
 * bất kỳ cấu trúc cây nào mà generator yield step có:
 *   graph : { nodes: [id], edges: [{u, v}] }   (bước đầu tiên, cây đầy đủ)
 *   keys  : [id]  → đường đi hiện tại / đỉnh đang tác động (tô đậm)
 *   values: { id: nhãn phụ }                    (giá trị chọn / dp / output)
 *   done  : các nút đã kết thúc (settled).
 *
 * Nút có 'values' hiển thị "id + nhãn" 2 dòng; nút lá output thường được
 * generator đánh giá trị riêng để người xem đọc trực tiếp kết quả.
 */
export default function TreeVisualizer({ steps = [], current = 0, height = 320 }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const graphSigRef = useRef('');
  const roRef = useRef(null);
  const currentRef = useRef(current);
  currentRef.current = current;

  // Khởi tạo cytoscape MỘT LẦN với bộ style — element (cây) được nạp trong
  // apply() vì lúc mount steps còn rỗng, cây đến sau khi generator chạy.
  useEffect(() => {
    let disposed = false;
    let cy;
    (async () => {
      const cytoscape = (await import('cytoscape')).default;
      if (disposed || !containerRef.current) return;
      cy = cytoscape({
        container: containerRef.current,
        elements: [],
        layout: {
          name: 'breadthfirst',
          directed: true,
          padding: 20,
          spacingFactor: 1.15,
          avoidOverlap: true,
        },
        style: [
          {
            selector: 'node',
            style: {
              label: 'data(label)',
              'text-valign': 'center',
              'text-halign': 'center',
              'background-color': '#eef1f5',
              'border-color': '#b7c0cb',
              'border-width': 2,
              width: 36,
              height: 36,
              'font-size': 11,
              'font-family': 'Cascadia Mono, Consolas, monospace',
              color: '#5b6572',
              'text-wrap': 'wrap',
            },
          },
          {
            selector: 'node.hit',
            style: { 'background-color': '#1e56a0', 'border-color': '#1e56a0', color: '#ffffff' },
          },
          {
            selector: 'node.done',
            style: { 'background-color': '#8fb3de', 'border-color': '#1e56a0', color: '#ffffff' },
          },
          {
            selector: 'edge',
            style: {
              width: 2,
              'line-color': '#b7c0cb',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#b7c0cb',
              'curve-style': 'bezier',
            },
          },
          {
            selector: 'edge.hit',
            style: { width: 4, 'line-color': '#1e56a0', 'target-arrow-color': '#1e56a0' },
          },
        ],
      });
      cyRef.current = cy;
      apply();
      // Đảm bảo render đúng khi khung thay đổi kích thước sau khi mount.
      const ro = new ResizeObserver(() => cy.resize());
      ro.observe(containerRef.current);
      roRef.current = ro;
      cy.fit(undefined, 24);
    })();
    return () => {
      disposed = true;
      roRef.current?.disconnect();
      cy?.destroy();
      cyRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    apply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, steps.length]);

  function apply() {
    const cy = cyRef.current;
    if (!cy) return;
    const step = steps[currentRef.current];

    // Đồng bộ element khi cây xuất hiện trong steps (lúc mount steps rỗng).
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
            data: { id: `e${i}`, source: e.u, target: e.v },
          })),
        );
        cy.layout({
          name: 'breadthfirst',
          directed: true,
          padding: 20,
          spacingFactor: 1.15,
          avoidOverlap: true,
        }).run();
        cy.fit(undefined, 30);
      }
    }

    const hit = new Set(step?.keys ?? []);
    const doneSet = new Set(step?.done ?? []);
    const hitEdges = new Set((step?.edges ?? []).map(([u, v]) => `${u}|${v}`));

    cy.nodes().forEach((n) => {
      const id = n.id();
      n.classes(hit.has(id) ? 'hit' : doneSet.has(id) ? 'done' : '');
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
