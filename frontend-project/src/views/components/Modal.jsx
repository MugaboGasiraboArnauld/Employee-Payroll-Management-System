import React from "react";

const Modal = ({ show, onClose, title, children }) =>
  show ? (
    <div className="overlay animate-fade-in" onClick={onClose}>
      <div className="modal animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="modal-title mb-0">{title}</h3>
          <button type="button" onClick={onClose} className="btn">X</button>
        </div>
        {children}
      </div>
    </div>
  ) : null;

export default Modal;
