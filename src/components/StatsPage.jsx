import React, { useMemo } from 'react'
import { todayKey } from '../utils/storage'

export default function StatsPage({ words, dailyStats, folders, activeFolderId, showWrongWords = true }) {
  const folderWords = words.filter((w) => w.folderId === activeFolderId)
  const activeFolder = folders.find((f) => f.id === activeFolderId)

  const { correct, wrong, rate } = useMemo(() => {
    const correct = folderWords.reduce((sum, w) => sum + w.stats.correctCount, 0)
    const wrong = folderWords.reduce((sum, w) => sum + w.stats.wrongCount, 0)
    const total = correct + wrong
    return { correct, wrong, rate: total > 0 ? Math.round((correct / total) * 100) : 0 }
  }, [folderWords])

  const todayCount = dailyStats[todayKey()] || 0

  const mostMissed = useMemo(() => {
    return [...folderWords]
      .filter((w) => w.stats.wrongCount > 0)
      .sort((a, b) => b.stats.wrongCount - a.stats.wrongCount)
      .slice(0, 5)
  }, [folderWords])

  return (
    <div className="card" style={showWrongWords ? {} : { marginBottom: '16px'}}>
      <h2 className="section-title">통계 — {activeFolder?.name}</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-num">{folderWords.length}</div>
          <div className="stat-card-label">전체 단어 수</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-num">{todayCount}</div>
          <div className="stat-card-label">오늘 푼 문제 수</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-num">{rate}%</div>
          <div className="stat-card-label">전체 정답률 ({correct}/{correct + wrong})</div>
        </div>
      </div>

      {showWrongWords && (
        <>
          <h3 className="section-title">자주 틀리는 단어 TOP 5</h3>
          {mostMissed.length === 0 ? (
            <div className="empty-state">
              <p>아직 오답 기록이 없어요.</p>
            </div>
          ) : (
            <div className="word-list">
              {mostMissed.map((w) => (
                <div className="word-item" key={w.id}>
                  <div className="word-main">
                    <div className="word-jp">
                      {w.kanji && <span className="kanji">{w.kanji}</span>}
                      {w.japanese}
                    </div>
                    <div className="word-kr">{w.korean}</div>
                    <div className="word-badges">
                      <span className="badge badge-high">오답 {w.stats.wrongCount}회</span>
                      <span className="badge badge-muted">정답 {w.stats.correctCount}회</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
