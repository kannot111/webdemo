import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import { STAGES, countTopics, countReady } from '@/lib/curriculum';
import styles from './page.module.css';

const WIKI_BASE = 'https://vnoi.info/wiki';

export default function HomePage() {
  const ready = countReady();

  return (
    <div className={styles.page}>
      <header className={styles.siteHead}>
        <div className={styles.headInner}>
          <Link href="/" className={styles.brand}>
            Sổ tay thuật toán
          </Link>
          <span className={styles.headNote}>Luyện thi tin học, từ cấp trường đến quốc gia</span>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Chương trình ôn thi</h1>
        <p className={styles.intro}>
          Ba giai đoạn từ nhập môn đến nâng cao. Mỗi chủ đề có bài lý thuyết kèm{' '}
          <strong>minh họa thuật toán chạy từng bước ngay trong web</strong> (player giống
          Algorithm Visualizer), giả mã, code mẫu C++/Python và bài tập thật từ VNOJ,
          Codeforces, CSES. Hiện đã có {ready} bài hoàn chỉnh, phần còn lại đang được viết
          theo thứ tự trong lộ trình.
        </p>

        <SearchBox />

        {STAGES.map((stage) => (
          <section key={stage.id} className={styles.stage} id={stage.id}>
            <div className={styles.stageHead}>
              <div>
                <h2 className={styles.stageName}>
                  {stage.name} <span className={styles.stageTag}>{stage.tag}</span>
                </h2>
                <p className={styles.stageGoal}>
                  Dành cho {stage.goal}, trình độ {stage.level}.
                </p>
              </div>
              <span className={styles.stageCount}>{countTopics(stage)} chủ đề</span>
            </div>

            {stage.groups.map((group) => (
              <div key={group.id} className={styles.group}>
                <h3 className={styles.groupName}>{group.name}</h3>
                <ul className={styles.topics}>
                  {group.topics.map((topic) => (
                    <li key={topic.name} className={styles.topic}>
                      {topic.slug ? (
                        <Link href={`/algorithms/${topic.slug}`} className={styles.topicLink}>
                          <span className={styles.topicName}>{topic.name}</span>
                          <span className={styles.topicEn}>{topic.en}</span>
                          <span className={styles.topicReady}>Đã có bài + visualizer</span>
                        </Link>
                      ) : (
                        <div className={styles.topicPlanned}>
                          <span className={styles.topicName}>{topic.name}</span>
                          <span className={styles.topicEn}>{topic.en}</span>
                        </div>
                      )}
                      {topic.detail && <p className={styles.topicDetail}>{topic.detail}</p>}
                      {topic.vnoi && (
                        <p className={styles.topicVnoi}>
                          Đọc thêm:{' '}
                          <a href={`${WIKI_BASE}${topic.vnoi}`} target="_blank" rel="noreferrer">
                            bài này trên VNOI Wiki
                          </a>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </main>

      <footer className={styles.siteFoot}>
        <div className={styles.headInner}>
          <span>Sổ tay thuật toán — tài liệu ôn thi tin học</span>
          <span className={styles.footCredit}>
            Kiến thức đối chiếu và bài tập tham khảo từ{' '}
            <a href="https://vnoi.info/wiki" target="_blank" rel="noreferrer">
              VNOI Wiki
            </a>
            . Minh họa lấy cảm hứng từ mô hình tracer của Algorithm Visualizer (MIT).
          </span>
        </div>
      </footer>
    </div>
  );
}
