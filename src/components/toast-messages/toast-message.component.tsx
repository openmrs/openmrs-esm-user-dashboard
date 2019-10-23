import React from "react";

import "./toast-message.css";

export default function ToastMessage(props: ToastMessageProperties) {
  const { type, message, onClose } = props;
  const icons = {
    error: "remove",
    success: "ok",
    warning: "warning-sign"
  };
  return (
    <div className="note-container top-right">
      <div className={`note ${type}`}>
        <div className="text">
          <i className={`icon-${icons[type]} medium`}></i>
          <p>{message}</p>
        </div>
        <div
          role="button"
          tabIndex={0}
          className="close-icon"
          onClick={onClose}
        >
          <i title="Close" className="icon-remove"></i>
        </div>
      </div>
    </div>
  );
}

type ToastMessageProperties = {
  type: string;
  message: string;
  onClose: any;
};
