import React from 'react'

export default function ConfirmModal({ title, message, confirmLabel = '확인', danger, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-box">
        <h3 className="modal-title" id="modal-title">
          {title}
        </h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn" onClick={onCancel}>
            취소
          </button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
