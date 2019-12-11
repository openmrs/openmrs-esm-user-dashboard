import React, { useState, useImperativeHandle } from "react";
import ToastMessage from "./toast-message.component";

import "./toast-message.css";

export default React.forwardRef(function ToastMessages(
  props: ToastMessagesProperties,
  ref
) {
  const [toasts, setToasts] = useState([]);
  const removeMessage = (removedToast: Toast) => {
    setToasts(existingToasts =>
      existingToasts.filter(toast => toast.id !== removedToast.id)
    );
  };

  useImperativeHandle(ref, () => {
    return {
      add(newToast) {
        setToasts(existingToasts => [...existingToasts, newToast]);
      }
    };
  });

  return (
    <div className="top-right toast-messages">
      {toasts.map(toast => {
        return (
          <ToastMessage
            key={toast.id}
            {...toast}
            onClose={() => removeMessage(toast)}
          ></ToastMessage>
        );
      })}
    </div>
  );
});

type ToastMessagesProperties = {};

type Toast = {
  type: string;
  message: string;
  id: string;
};
