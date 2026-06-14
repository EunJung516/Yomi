import React, { useState } from 'react'
import FolderBar from './FolderBar'
import DictionaryImport from './DictionaryImport'
import WordForm from './WordForm'
import WordList from './WordList'
import Toolbar from './Toolbar'
import { generateId } from '../utils/storage'

export default function Library({
  folders,
  words,
  settings,
  activeFolderId,
  onSetActiveFolder,
  onAddFolder,
  onRenameFolder,
  onDeleteFolder,
  onUpdateWords,
  onSettingsChange,
  onImport,
  onDeleteAll,
}) {
  const [editingWord, setEditingWord] = useState(null)

  const folderWords = words.filter((w) => w.folderId === activeFolderId)

  const handleSave = (data) => {
    if (editingWord) {
      onUpdateWords(
        words.map((w) =>
          w.id === editingWord.id ? { ...w, ...data, updatedAt: Date.now() } : w
        )
      )
      setEditingWord(null)
    } else {
      const now = Date.now()
      const newWord = {
        id: generateId('word'),
        folderId: activeFolderId,
        kanji: data.kanji,
        japanese: data.japanese,
        korean: data.korean,
        createdAt: now,
        updatedAt: now,
        favorite: false,
        stats: {
          correctCount: 0,
          wrongCount: 0,
          lastStudiedAt: null,
          difficultyScore: 0,
        },
      }
      onUpdateWords([newWord, ...words])
    }
  }

  const handleDelete = (id) => {
    onUpdateWords(words.filter((w) => w.id !== id))
    if (editingWord?.id === id) setEditingWord(null)
  }

  const handleToggleFavorite = (id) => {
    onUpdateWords(words.map((w) => (w.id === id ? { ...w, favorite: !w.favorite } : w)))
  }

  return (
    <div>
      <FolderBar
        folders={folders}
        words={words}
        activeFolderId={activeFolderId}
        onSelect={(id) => {
          onSetActiveFolder(id)
          setEditingWord(null)
        }}
        onAddFolder={onAddFolder}
        onRenameFolder={onRenameFolder}
        onDeleteFolder={onDeleteFolder}
      />

      <WordForm
        words={words}
        folderId={activeFolderId}
        editingWord={editingWord}
        onSave={handleSave}
        onCancelEdit={() => setEditingWord(null)}
      />

      <DictionaryImport words={words} folderId={activeFolderId} onUpdateWords={onUpdateWords} />

      <Toolbar
        settings={settings}
        onSettingsChange={onSettingsChange}
        onImport={onImport}
        onDeleteAll={onDeleteAll}
      />

      <WordList
        words={folderWords}
        settings={settings}
        onEdit={setEditingWord}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  )
}
