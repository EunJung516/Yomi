import React, { useState } from 'react'
import StudyConfig from './StudyConfig'
import StudySession from './StudySession'
import SessionSummary from './SessionSummary'

const STAGE = { CONFIG: 'config', SESSION: 'session', SUMMARY: 'summary' }

export default function StudyPage({
  words,
  folders,
  activeFolderId,
  settings,
  lastSessionWrong,
  onUpdateWords,
  onSessionFinished,
}) {
  const [stage, setStage] = useState(STAGE.CONFIG)
  const [mode, setMode] = useState(null)
  const [filterId, setFilterId] = useState('all')
  const [range, setRange] = useState(null)
  const [results, setResults] = useState([])

  const startSession = (selectedMode, selectedFilter, selectedRange) => {
    setMode(selectedMode)
    setFilterId(selectedFilter)
    setRange(selectedRange || null)
    setStage(STAGE.SESSION)
  }

  const handleFinish = (sessionResults) => {
    setResults(sessionResults)
    onSessionFinished(activeFolderId, sessionResults)
    setStage(STAGE.SUMMARY)
  }

  const retryWrong = () => {
    setFilterId('last-session-wrong')
    setStage(STAGE.SESSION)
  }

  if (stage === STAGE.SESSION && mode) {
    return (
      <StudySession
        words={words}
        folderId={activeFolderId}
        mode={mode}
        filterId={filterId}
        range={range}
        settings={settings}
        lastSessionWrong={lastSessionWrong}
        onUpdateWords={onUpdateWords}
        onFinish={handleFinish}
      />
    )
  }

  if (stage === STAGE.SUMMARY) {
    return (
      <SessionSummary
        results={results}
        onRetryWrong={retryWrong}
        onBackToConfig={() => setStage(STAGE.CONFIG)}
      />
    )
  }

  return (
    <StudyConfig
      words={words}
      folders={folders}
      activeFolderId={activeFolderId}
      settings={settings}
      lastSessionWrong={lastSessionWrong}
      onStart={startSession}
    />
  )
}
