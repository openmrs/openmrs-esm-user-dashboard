import React from "react";
import { render, fireEvent } from "@testing-library/react";

import ToastMessage from "./toast-message.component";

describe("ToastMessage", () => {
  it("should show message", () => {
    const { getByText } = render(
      <ToastMessage
        type="success"
        message="test message"
        onClose={jest.fn()}
        id={"123"}
      ></ToastMessage>
    );

    expect(getByText("test message")).toBeTruthy();
  });

  it("should call onClose on clicking close button", () => {
    const mockOnClose = jest.fn();
    const { getByTitle } = render(
      <ToastMessage
        type="success"
        message="test message"
        onClose={mockOnClose}
        id={"456"}
      ></ToastMessage>
    );

    fireEvent.click(getByTitle("Close"));

    expect(mockOnClose.mock.calls.length).toEqual(1);
  });
});
