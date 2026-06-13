import React, { useMemo, useState } from 'react'
import { STUDY_MODES, FILTERS, filterWordsByModeRequirement, getEligibleWords } from '../utils/quiz'

export default function StudyConfig({ words, folders, activeFolderId, settings, lastSessionWrong, onStart }) {
  const [modeId, setModeId] = useState(STUDY_MODES[0].id)
  const [filterId, setFilterId] = useState('all')

  const mode = STUDY_MODES.find((m) => m.id === modeId)

  const eligibleCount = useMemo(() => {
    const byFilter = getEligibleWords({
      words,
      folderId: activeFolderId,
      filter: filterId,
      settings,
      lastSessionWrong,
    })
    return filterWordsByModeRequirement(byFilter, mode).length
  }, [words, activeFolderId, filterId, settings, lastSessionWrong, mode])

  const activeFolder = folders.find((f) => f.id === activeFolderId)

  return (
    <div className="card">
      <h2 className="section-title">공부하기 — {activeFolder?.name}</h2>

      <div style={{display: 'flex', gap: 16}}>
        <div style={{flex: 1}}>
          <h3 className="section-title" style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            퀴즈 모드
          </h3>
          <div className="option-grid" role="radiogroup" aria-label="퀴즈 모드 선택">
            {STUDY_MODES.map((m) => (
              <label key={m.id} className={`option-card ${modeId === m.id ? 'selected' : ''}`}>
                <div>
                  <div className="option-card-label">{m.label}</div>
                  {/* {m.requiresKanji && <div className="option-card-desc">한자가 등록된 단어만 출제돼요</div>} */}
                  {/* {m.isAudio && <div className="option-card-desc">먼저 발음을 듣고, 정답 확인 후 표기를 볼 수 있어요</div>} */}
                </div>
                <input
                  type="radio"
                  name="mode"
                  value={m.id}
                  checked={modeId === m.id}
                  onChange={() => setModeId(m.id)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </div>

        <div style={{flex: 1}}>
          <h3 className="section-title" style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            출제 범위
          </h3>
          <div className="option-grid" role="radiogroup" aria-label="출제 범위 선택">
            {FILTERS.map((f) => (
              <label key={f.id} className={`option-card ${filterId === f.id ? 'selected' : ''}`}>
                <div className="option-card-label">{f.label}</div>
                <input
                  type="radio"
                  name="filter"
                  value={f.id}
                  checked={filterId === f.id}
                  onChange={() => setFilterId(f.id)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="section-gap" style={{textAlign: 'right'}}>
        <p className="hint-text" style={{ marginBottom: 10 }}>
          이 조건으로 출제 가능한 단어: <strong>{eligibleCount}개</strong>
        </p>
        <button
          className="btn btn-primary"
          disabled={eligibleCount === 0}
          onClick={() => onStart(mode, filterId)}
        >
          학습 시작
        </button>
        {eligibleCount === 0 && (
          <p className="error-text">선택한 조건에 해당하는 단어가 없어요. 다른 모드나 범위를 선택해보세요.</p>
        )}
      </div>
    </div>
  )
}
