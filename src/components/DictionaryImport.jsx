import React, { useState } from 'react'
import { DICTIONARY_SETS } from '../data/dictionary'
import { generateId } from '../utils/storage'

// 선택한 폴더에 레벨별 사전 세트를 일괄로 불러옵니다.
// 같은 폴더 내에 이미 존재하는 일본어 단어는 건너뜁니다.
export default function DictionaryImport({ words, folderId, onUpdateWords }) {
  const [setId, setSetId] = useState(DICTIONARY_SETS[0]?.id || '')
  const [message, setMessage] = useState('')

  if (DICTIONARY_SETS.length === 0) return null

  const handleImport = () => {
    const set = DICTIONARY_SETS.find((s) => s.id === setId)
    if (!set) return

    const existing = new Set(
      words.filter((w) => w.folderId === folderId).map((w) => w.japanese.trim().toLowerCase())
    )

    const now = Date.now()
    const newWords = []
    set.words.forEach((entry, i) => {
      const key = entry.japanese.trim().toLowerCase()
      if (existing.has(key)) return
      existing.add(key)
      newWords.push({
        id: generateId('word'),
        folderId,
        kanji: entry.kanji || '',
        japanese: entry.japanese,
        korean: entry.korean,
        createdAt: now - i, // 사전 내 순서를 최신순 정렬에 반영
        updatedAt: now,
        favorite: false,
        stats: { correctCount: 0, wrongCount: 0, lastStudiedAt: null, difficultyScore: 0 },
      })
    })

    if (newWords.length === 0) {
      setMessage('이미 모두 등록된 단어들이라 추가된 항목이 없어요.')
      return
    }

    onUpdateWords([...newWords, ...words])
    setMessage(`${newWords.length}개의 단어를 불러왔어요. (중복 ${set.words.length - newWords.length}개 제외)`)
  }

  return (
    <div className="card section-gap">
      <h2 className="section-title">사전 세트 불러오기</h2>
      <div className="form-row">
        <div className="form-field" style={{ maxWidth: 200 }}>
          <label htmlFor="dict-set">사전 세트 선택</label>
          <select id="dict-set" className="input" value={setId} onChange={(e) => setSetId(e.target.value)}>
            {DICTIONARY_SETS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} ({s.words.length}개)
              </option>
            ))}
          </select>
        </div>
        <div className="form-field" style={{ flex: '0 0 auto', alignSelf: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={handleImport}>
            현재 폴더로 불러오기
          </button>
        </div>
      </div>
      {message && <p className="hint-text">{message}</p>}
    </div>
  )
}