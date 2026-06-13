import React, { useRef, useState } from 'react'
import ConfirmModal from './ConfirmModal'
import { buildExportData, importData } from '../utils/storage'

export default function Toolbar({ settings, onSettingsChange, onImport, onDeleteAll }) {
  const fileInputRef = useRef(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [importMessage, setImportMessage] = useState('')

  const handleExport = () => {
    const data = buildExportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jp-vocab-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        importData(data)
        setImportMessage('가져오기가 완료되었습니다. 새로고침합니다.')
        onImport()
      } catch (err) {
        setImportMessage('가져오기에 실패했어요: 올바른 JSON 파일인지 확인해주세요.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="card section-gap">
      <h2 className="section-title">설정 &amp; 데이터 관리</h2>

      <div className="toolbar-row">
        <label className="toggle-row" htmlFor="kanji-toggle">
          <span className="switch">
            <input
              id="kanji-toggle"
              type="checkbox"
              checked={settings.showKanji}
              onChange={(e) => onSettingsChange({ ...settings, showKanji: e.target.checked })}
            />
            <span className="switch-slider" />
          </span>
          한자 표시
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm" onClick={handleExport}>
            내보내기 (JSON)
          </button>
          <button className="btn btn-sm" onClick={() => fileInputRef.current?.click()}>
            가져오기 (JSON)
          </button>
          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
          <button className="btn btn-sm btn-danger" onClick={() => setConfirmOpen(true)}>
            전체 삭제
          </button>
        </div>
      </div>

      <div className="recent-count-control">
        <label htmlFor="recent-count">최근 추가 단어 기준 개수</label>
        <input
          id="recent-count"
          type="number"
          min={1}
          max={500}
          className="input"
          value={settings.recentCount}
          onChange={(e) =>
            onSettingsChange({ ...settings, recentCount: Math.max(1, Number(e.target.value) || 1) })
          }
        />
        <span className="hint-text" style={{ margin: 0 }}>
          개 (단어 목록 배지 및 '최근 추가 단어만' 필터에 사용돼요)
        </span>
      </div>

      {importMessage && <p className="hint-text">{importMessage}</p>}

      {confirmOpen && (
        <ConfirmModal
          title="모든 단어 삭제"
          message="모든 폴더와 단어, 학습 기록이 영구적으로 삭제됩니다. 계속할까요?"
          confirmLabel="전체 삭제"
          danger
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            onDeleteAll()
            setConfirmOpen(false)
          }}
        />
      )}
    </div>
  )
}
