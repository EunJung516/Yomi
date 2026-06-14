import React, { useEffect, useState } from 'react'
import Library from './components/Library'
import StudyPage from './components/StudyPage'
import StatsPage from './components/StatsPage'
import FolderBar from './components/FolderBar'
import {
  loadFolders,
  saveFolders,
  loadWords,
  saveWords,
  loadSettings,
  saveSettings,
  loadLastSessionWrong,
  saveLastSessionWrong,
  loadDailyStats,
  saveDailyStats,
  todayKey,
  generateId,
  clearAllData,
} from './utils/storage'

const TABS = [
  { id: 'study', label: '공부하기' },
  { id: 'library', label: '단어장' },
  { id: 'stats', label: '통계' },
]

export default function App() {
  const [folders, setFolders] = useState(loadFolders)
  const [words, setWords] = useState(loadWords)
  const [settings, setSettings] = useState(loadSettings)
  const [lastSessionWrong, setLastSessionWrong] = useState(loadLastSessionWrong)
  const [dailyStats, setDailyStats] = useState(loadDailyStats)
  const [activeFolderId, setActiveFolderId] = useState(() => loadFolders()[0]?.id)
  const [activeTab, setActiveTab] = useState('study')

  useEffect(() => saveFolders(folders), [folders])
  useEffect(() => saveWords(words), [words])
  useEffect(() => saveSettings(settings), [settings])
  useEffect(() => saveLastSessionWrong(lastSessionWrong), [lastSessionWrong])
  useEffect(() => saveDailyStats(dailyStats), [dailyStats])

  // 폴더가 삭제되거나 없을 때 활성 폴더를 보정합니다.
  useEffect(() => {
    if (!folders.find((f) => f.id === activeFolderId) && folders.length > 0) {
      setActiveFolderId(folders[0].id)
    }
  }, [folders, activeFolderId])

  const handleAddFolder = (name) => {
    const newFolder = { id: generateId('folder'), name, createdAt: Date.now() }
    setFolders((prev) => [...prev, newFolder])
    setActiveFolderId(newFolder.id)
  }

  const handleRenameFolder = (folderId, name) => {
    setFolders((prev) => prev.map((f) => (f.id === folderId ? { ...f, name } : f)))
  }

  const handleDeleteFolder = (folderId) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId))
    setWords((prev) => prev.filter((w) => w.folderId !== folderId))
    setLastSessionWrong((prev) => {
      const next = { ...prev }
      delete next[folderId]
      return next
    })
  }

  const handleSessionFinished = (folderId, results) => {
    const wrongIds = results.filter((r) => r.judgement === 'wrong').map((r) => r.wordId)
    setLastSessionWrong((prev) => ({ ...prev, [folderId]: wrongIds }))

    const key = todayKey()
    setDailyStats((prev) => ({ ...prev, [key]: (prev[key] || 0) + results.length }))
  }

  const handleImport = () => {
    // localStorage가 갱신되었으므로 상태를 다시 불러옵니다.
    setFolders(loadFolders())
    setWords(loadWords())
    setSettings(loadSettings())
    setLastSessionWrong(loadLastSessionWrong())
    setDailyStats(loadDailyStats())
  }

  const handleDeleteAll = () => {
    clearAllData()
    setWords([])
    setFolders(loadFolders())
    setLastSessionWrong({})
    setDailyStats({})
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="app-title">
            ૮₍ •̀ ⩊ •́ ₎ა <span>일본어 암기</span>
          </h1>
          <nav className="app-nav" aria-label="주요 메뉴">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container">
        {activeTab === 'library' && (
          <Library
            folders={folders}
            words={words}
            settings={settings}
            activeFolderId={activeFolderId}
            onSetActiveFolder={setActiveFolderId}
            onAddFolder={handleAddFolder}
            onRenameFolder={handleRenameFolder}
            onDeleteFolder={handleDeleteFolder}
            onUpdateWords={setWords}
            onSettingsChange={setSettings}
            onImport={handleImport}
            onDeleteAll={handleDeleteAll}
          />
        )}

        {activeTab === 'study' && (
          <>
            <FolderBar
              folders={folders}
              words={words}
              activeFolderId={activeFolderId}
              onSelect={(id) => {
                setActiveFolderId(id)
                setEditingWord(null)
              }}
              onAddFolder={handleAddFolder}
              onRenameFolder={handleRenameFolder}
              showEdit={false}
            />
            <StatsPage
              words={words}
              dailyStats={dailyStats}
              folders={folders}
              activeFolderId={activeFolderId}
              showWrongWords={false}
            />
            <StudyPage
              words={words}
              folders={folders}
              activeFolderId={activeFolderId}
              settings={settings}
              lastSessionWrong={lastSessionWrong}
              onUpdateWords={setWords}
              onSessionFinished={handleSessionFinished}
            />
          </>
        )}

        {activeTab === 'stats' && (
          <StatsPage
            words={words}
            dailyStats={dailyStats}
            folders={folders}
            activeFolderId={activeFolderId}
          />
        )}
      </main>
    </div>
  )
}
