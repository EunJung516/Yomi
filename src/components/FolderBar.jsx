import React, { useState } from 'react'
import ConfirmModal from './ConfirmModal'

export default function FolderBar({ folders, words, activeFolderId, onSelect, onAddFolder, onRenameFolder, onDeleteFolder, showEdit = true }) {
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [deletingFolder, setDeletingFolder] = useState(null)

  const countFor = (folderId) => words.filter((w) => w.folderId === folderId).length

  const startEdit = (folder) => {
    setEditingId(folder.id)
    setEditValue(folder.name)
  }

  const submitEdit = (folderId) => {
    const trimmed = editValue.trim()
    if (trimmed) onRenameFolder(folderId, trimmed)
    setEditingId(null)
  }

  const submitAdd = () => {
    const trimmed = newName.trim()
    if (trimmed) onAddFolder(trimmed)
    setNewName('')
    setAdding(false)
  }

  const confirmDelete = () => {
    onDeleteFolder(deletingFolder.id)
    setDeletingFolder(null)
  }

  return (
    <>
      <div className="folder-bar" role="tablist" aria-label="단어장 폴더">
        {folders.map((folder) => (
          <div key={folder.id} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {editingId === folder.id ? (
              <input
                className="input"
                style={{ width: 120, padding: '4px 8px', fontSize: 13 }}
                value={editValue}
                autoFocus
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => submitEdit(folder.id)}
                onKeyDown={(e) => e.key === 'Enter' && submitEdit(folder.id)}
                aria-label="폴더 이름 수정"
              />
            ) : (
              <button
                role="tab"
                aria-selected={activeFolderId === folder.id}
                className={`folder-tab ${activeFolderId === folder.id ? 'active' : ''}`}
                onClick={() => onSelect(folder.id)}
                onDoubleClick={() => startEdit(folder)}
                title="더블클릭하면 이름을 수정할 수 있어요"
              >
                {folder.name}
                <span className="folder-count">{countFor(folder.id)}</span>
              </button>
            )}
            {showEdit && activeFolderId === folder.id && editingId !== folder.id && (
              <>
                <button className="folder-edit-btn" onClick={() => startEdit(folder)} aria-label="폴더 이름 수정">
                  ✎
                </button>
                <button
                  className="folder-edit-btn"
                  onClick={() => setDeletingFolder(folder)}
                  aria-label="폴더 삭제"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        ))}

        {adding ? (
          <input
            className="input"
            style={{ width: 120, padding: '4px 8px', fontSize: 13 }}
            placeholder="폴더 이름"
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={submitAdd}
            onKeyDown={(e) => e.key === 'Enter' && submitAdd()}
            aria-label="새 폴더 이름 입력"
          />
        ) : (
          <button className="folder-add-btn" onClick={() => setAdding(true)}>
            + 새 폴더
          </button>
        )}
      </div>

      {deletingFolder && (
        <ConfirmModal
          title={`"${deletingFolder.name}" 폴더 삭제`}
          message={`폴더 안의 단어 ${countFor(deletingFolder.id)}개가 함께 삭제됩니다. 계속할까요?`}
          confirmLabel="삭제"
          danger
          onConfirm={confirmDelete}
          onCancel={() => setDeletingFolder(null)}
        />
      )}
    </>
  )
}
