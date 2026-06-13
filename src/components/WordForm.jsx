import React, { useEffect, useState } from 'react'
import { lookupByKorean } from '../data/dictionary'

const emptyForm = { kanji: '', japanese: '', korean: '' }

export default function WordForm({ words, folderId, editingWord, onSave, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [autoFilled, setAutoFilled] = useState(false)

  useEffect(() => {
    if (editingWord) {
      setForm({
        kanji: editingWord.kanji || '',
        japanese: editingWord.japanese || '',
        korean: editingWord.korean || '',
      })
    } else {
      setForm(emptyForm)
    }

    setError('')
    setAutoFilled(false)
  }, [editingWord])

  const resetForm = () => {
    setForm(emptyForm)
    setError('')
    setAutoFilled(false)
  }

  // const handleKoreanChange = (value) => {
  //   setForm((prev) => {
  //     const next = { ...prev, korean: value }
  //     // 일본어 칸이 비어있을 때만 사전에서 자동완성을 시도합니다.
  //     if (!prev.japanese.trim()) {
  //       const match = lookupByKorean(value)
  //       if (match) {
  //         next.japanese = match.japanese
  //         next.kanji = match.kanji || ''
  //         setAutoFilled(true)
  //       }
  //     }
  //     return next
  //   })
  //   setError('')
  // }
  const handleKoreanChange = (value) => {
    const match = lookupByKorean(value)

    setForm((prev) => {
      const next = { ...prev, korean: value }

      if (match) {
        next.japanese = match.japanese
        next.kanji = match.kanji || ''
      } else if (autoFilled) {
        next.japanese = ''
        next.kanji = ''
      }

      return next
    })

    setAutoFilled(Boolean(match))
    setError('')
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))

    if (field === 'japanese' || field === 'kanji') {
      setAutoFilled(false)
    }

    setError('')
  }

  const isDuplicate = (japanese) => {
    const target = japanese.trim().toLowerCase()
    return words.some(
      (w) =>
        w.folderId === folderId &&
        w.japanese.trim().toLowerCase() === target &&
        w.id !== editingWord?.id
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const japanese = form.japanese.trim()
    const korean = form.korean.trim()

    if (!japanese || !korean) {
      setError('일본어와 한국어 뜻은 필수 입력 항목입니다.')
      return
    }

    if (isDuplicate(japanese)) {
      setError('이 폴더에는 이미 같은 일본어 단어가 등록되어 있어요.')
      return
    }

    onSave({
      kanji: form.kanji.trim(),
      japanese,
      korean,
    })

    if (!editingWord) resetForm()
  }

  return (
    <form className="card" onSubmit={handleSubmit} aria-label={editingWord ? '단어 수정' : '단어 추가'}>
      <h2 className="section-title">{editingWord ? '단어 수정' : '새 단어 추가'}</h2>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="word-korean">한국어 뜻 (필수)</label>
          <input
            id="word-korean"
            className="input"
            value={form.korean}
            onChange={(e) => handleKoreanChange(e.target.value)}
            placeholder="예: 학교"
          />
        </div>
        <div className="form-field">
          <label htmlFor="word-japanese">일본어 (필수)</label>
          <input
            id="word-japanese"
            className="input"
            value={form.japanese}
            onChange={(e) => handleChange('japanese', e.target.value)}
            placeholder="예: がっこう"
          />
        </div>
        <div className="form-field">
          <label htmlFor="word-kanji">한자 (선택)</label>
          <input
            id="word-kanji"
            className="input"
            value={form.kanji}
            onChange={(e) => handleChange('kanji', e.target.value)}
            placeholder="예: 学校"
          />
        </div>
      </div>

      {autoFilled && (
        <p className="hint-text">사전에서 일본어/한자를 자동으로 채웠어요. 필요하면 직접 수정하세요.</p>
      )}
      {error && <p className="error-text" role="alert">{error}</p>}

      <div className="form-row" style={{ marginTop: 8 }}>
        <button type="submit" className="btn btn-primary">
          {editingWord ? '수정 완료' : '단어 추가'}
        </button>
        {editingWord && (
          <button type="button" className="btn" onClick={onCancelEdit}>
            취소
          </button>
        )}
      </div>
    </form>
  )
}
