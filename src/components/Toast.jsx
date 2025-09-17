import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose, timeout = 2500 }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => onClose?.(), timeout);
    return () => clearTimeout(id);
  }, [message, timeout, onClose]);

  if (!message) return null;

  return (
    <div className={`toast ${type}`}>
      {message}
      <button className="toast-close" onClick={onClose} aria-label="close">×</button>
    </div>
  );
}
