import React from 'react'

export default function SessionSummary({ results, onRetryWrong, onBackToConfig }) {
  const total = results.length
  const correct = results.filter((r) => r.judgement === 'correct').length
  const wrong = results.filter((r) => r.judgement === 'wrong').length
  const ambiguous = results.filter((r) => r.judgement === 'ambiguous').length
  const rate = total > 0 ? Math.round((correct / total) * 100) : 0
  const wrongWords = results.filter((r) => r.judgement === 'wrong')

  return (
    <div className="card">
      <h2 className="section-title">학습 결과</h2>

      <div className="summary-grid">
        <div className="summary-stat">
          <div className="summary-stat-num">{total}</div>
          <div className="summary-stat-label">전체 문항</div>
        </div>
        <div className="summary-stat">
          <div className="summary-stat-num" style={{ color: 'var(--color-success)' }}>
            {correct}
          </div>
          <div className="summary-stat-label">맞음</div>
        </div>
        <div className="summary-stat">
          <div className="summary-stat-num" style={{ color: 'var(--color-danger)' }}>
            {wrong}
          </div>
          <div className="summary-stat-label">틀림</div>
        </div>
        <div className="summary-stat">
          <div className="summary-stat-num">{rate}%</div>
          <div className="summary-stat-label">정답률 (애매함 {ambiguous})</div>
        </div>
      </div>

      <div className="summary-actions">
        {wrongWords.length > 0 && (
          <button className="btn btn-primary" onClick={onRetryWrong}>
            오답만 다시 풀기 ({wrongWords.length}개)
          </button>
        )}
        <button className="btn" onClick={onBackToConfig}>
          학습 설정으로 돌아가기
        </button>
      </div>

      {wrongWords.length > 0 && (
        <>
          <h3 className="section-title">오답노트</h3>
          <div className="word-list">
            {wrongWords.map((r) => (
              <div className="word-item" key={r.wordId}>
                <div className="word-main">
                  <div className="word-jp">
                    {r.kanji && <span className="kanji">{r.kanji}</span>}
                    {r.japanese}
                  </div>
                  <div className="word-kr">{r.korean}</div>
                  <div className="word-badges">
                    <span className="badge badge-muted">내가 쓴 답: {r.userAnswer || '(빈 칸)'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {wrongWords.length === 0 && total > 0 && (
        <div className="empty-state">
          <div className="empty-state-emoji">🎉</div>
          <p>오답 없이 모두 맞혔어요! 다음 세션도 화이팅이에요.</p>
        </div>
      )}
    </div>
  )
}
