import React, { useMemo, useState } from 'react'
import { difficultyLabel } from '../utils/quiz'

function formatDate(timestamp) {
  if (!timestamp) return '학습 기록 없음'
  const d = new Date(timestamp)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default function WordList({ words, settings, onEdit, onDelete, onToggleFavorite }) {
  const [search, setSearch] = useState('')

  const sorted = useMemo(() => [...words].sort((a, b) => b.createdAt - a.createdAt), [words])

  const recentIds = useMemo(() => {
    const ids = new Set()
    sorted.slice(0, settings.recentCount).forEach((w) => ids.add(w.id))
    return ids
  }, [sorted, settings.recentCount])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return sorted
    return sorted.filter(
      (w) =>
        w.japanese.toLowerCase().includes(term) ||
        w.korean.toLowerCase().includes(term) ||
        (w.kanji || '').toLowerCase().includes(term)
    )
  }, [sorted, search])

  if (sorted.length === 0) {
    return (
      <div className="card section-gap">
        <div className="empty-state">
          <div className="empty-state-emoji">📝</div>
          <p>아직 등록된 단어가 없어요.</p>
          <p>위 양식에서 첫 단어를 추가해보세요!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card section-gap">
      <h2 className="section-title">단어 목록 ({sorted.length}개)</h2>
      <div className="search-row">
        <input
          className="input"
          placeholder="일본어, 한자, 한국어로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="단어 검색"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>검색 결과가 없어요.</p>
        </div>
      ) : (
        <div className="word-list">
          {filtered.map((word) => {
            const diff = difficultyLabel(word.stats.difficultyScore)
            return (
              <div className="word-item" key={word.id}>
                <div className="word-main">
                  <div className="word-jp">
                    {word.kanji && <span className="kanji">{word.kanji}</span>}
                    {word.japanese}
                  </div>
                  <div className="word-kr">{word.korean}</div>
                  <div className="word-badges">
                    {recentIds.has(word.id) && (
                      <span className="badge badge-recent">최근 {settings.recentCount}단어</span>
                    )}
                    {word.favorite && <span className="badge badge-fav">★ 즐겨찾기</span>}
                    <span className={`badge badge-${diff.tone}`}>난이도 {diff.text}</span>
                    <span className="badge badge-muted">
                      정답 {word.stats.correctCount} · 오답 {word.stats.wrongCount}
                    </span>
                    <span className="badge badge-muted">최근 학습: {formatDate(word.stats.lastStudiedAt)}</span>
                  </div>
                </div>
                <div className="word-actions">
                  <button
                    className="btn-ghost"
                    aria-label={word.favorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                    onClick={() => onToggleFavorite(word.id)}
                    title="즐겨찾기"
                  >
                    {word.favorite ? '★' : '☆'}
                  </button>
                  <button
                    className="btn-ghost"
                    aria-label="단어 수정"
                    onClick={() => {
                      onEdit(word);
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }}
                    title="수정"
                  >
                    ✎
                  </button>
                  <button
                    className="btn-ghost"
                    aria-label="단어 삭제"
                    onClick={() => onDelete(word.id)}
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
