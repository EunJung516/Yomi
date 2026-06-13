import React, { useEffect, useRef, useState } from 'react'
import {
  getEligibleWords,
  filterWordsByModeRequirement,
  shuffleArray,
  isAnswerCorrect,
  updateWordStats,
} from '../utils/quiz'
import { speakJapanese, isSpeechSupported } from '../utils/speech'

export default function StudySession({
  words,
  folderId,
  mode,
  filterId,
  range,
  settings,
  lastSessionWrong,
  onUpdateWords,
  onFinish,
}) {
  const [queue, setQueue] = useState(() => buildQueue())
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [autoCorrect, setAutoCorrect] = useState(null)
  const [results, setResults] = useState([])
  const inputRef = useRef(null)

  function buildQueue() {
    const eligible = getEligibleWords({ words, folderId, filter: filterId, settings, lastSessionWrong, range })
    return shuffleArray(filterWordsByModeRequirement(eligible, mode))
  }

  const current = queue[index]
  const total = queue.length

  useEffect(() => {
    setAnswer('')
    setRevealed(false)
    setAutoCorrect(null)
    if (mode.isAudio && current) {
      speakJapanese(current.japanese)
    }
    if (inputRef.current) inputRef.current.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  if (!current) {
    return (
      <div className="card">
        <div className="empty-state">
          <p>출제할 단어가 없습니다.</p>
        </div>
      </div>
    )
  }

  const getFieldValue = (word, field) => {
    if (field === 'kanji') return word.kanji
    if (field === 'japanese') return word.japanese
    if (field === 'korean') return word.korean
    return ''
  }

  const correctAnswer = getFieldValue(current, mode.answerField)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (revealed) return
    const correct = isAnswerCorrect(answer, correctAnswer)
    setAutoCorrect(correct)
    setRevealed(true)
  }

  const finalizeAnswer = (judgement) => {
    const updatedWord = updateWordStats(current, judgement)
    onUpdateWords(words.map((w) => (w.id === current.id ? updatedWord : w)))

    const result = {
      wordId: current.id,
      japanese: current.japanese,
      kanji: current.kanji,
      korean: current.korean,
      userAnswer: answer,
      correctAnswer,
      judgement,
    }
    const nextResults = [...results, result]
    setResults(nextResults)

    if (index + 1 < total) {
      setIndex(index + 1)
    } else {
      onFinish(nextResults)
    }
  }

  const renderQuestion = () => {
    if (mode.isAudio) {
      return (
        <div className="question-card">
          <div className="question-label">발음을 듣고 한국어 뜻을 맞혀보세요</div>
          {revealed ? (
            <>
              <div className="question-text">
                {current.kanji && <span style={{ color: 'var(--color-accent-strong)' }}>{current.kanji} </span>}
                {current.japanese}
              </div>
            </>
          ) : (
            <div className="question-text" aria-hidden="true">
              🔊
            </div>
          )}
          <div className="speak-row">
            <button
              className="btn"
              onClick={() => speakJapanese(current.japanese)}
              disabled={!isSpeechSupported()}
            >
              🔊 다시 듣기
            </button>
          </div>
          {!isSpeechSupported() && (
            <p className="error-text">이 브라우저는 음성 합성을 지원하지 않아요.</p>
          )}
        </div>
      )
    }

    let questionText = getFieldValue(current, mode.questionField)
    let sub = null
    // 일본어를 보여주는 모드에서는 한자 표시 토글을 적용합니다.
    if (mode.questionField === 'japanese' && settings.showKanji && current.kanji) {
      sub = current.kanji
    }

    return (
      <div className="question-card">
        <div className="question-label">{mode.label}</div>
        <div className="question-text">{questionText}</div>
        {sub && <div className="question-sub">{sub}</div>}
      </div>
    )
  }

  return (
    <div className="card">
      <div className="study-progress">
        <span>
          {index + 1} / {total}
        </span>
        <span>{mode.label}</span>
      </div>

      {renderQuestion()}

      {!revealed ? (
        <form className="answer-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="input"
            placeholder="정답 입력"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            aria-label="정답 입력"
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary">
            제출
          </button>
        </form>
      ) : (
        <div className="reveal-box">
          <div className={`reveal-result ${autoCorrect ? 'correct' : 'wrong'}`}>
            {autoCorrect ? '✅ 정답!' : '❌ 오답'}
          </div>
          <div className="reveal-answer">{correctAnswer}</div>
          {mode.isAudio && (
            <div className="reveal-meta">
              {current.kanji && `${current.kanji} · `}
              {current.japanese}
            </div>
          )}
          {answer.trim() && (
            <div className="reveal-meta">내가 쓴 답: {answer}</div>
          )}
          <p className="hint-text">실제 결과를 직접 선택해서 학습 기록에 반영해주세요.</p>
          <div className="judge-row">
            <button className="btn btn-secondary" onClick={() => finalizeAnswer('correct')}>
              ⭕ 맞음
            </button>
            <button className="btn btn-danger" onClick={() => finalizeAnswer('wrong')}>
              ❌ 틀림
            </button>
            {/* <button className="btn" onClick={() => finalizeAnswer('ambiguous')}>
              🤔 애매함
            </button> */}
          </div>
        </div>
      )}
    </div>
  )
}
