import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import ToastMessages from "./index.component";

describe("ToastMessage", () => {
  it("should show all messages", () => {
    const toastMessageRef = React.createRef();
    const { getByText } = render(
      <ToastMessages ref={toastMessageRef}></ToastMessages>
    );
    const addMessage = toastMessageRef.current["add"];
    act(() => {
      addMessage({
        type: "success",
        message: "first message"
      });
    });

    expect(getByText("first message")).toBeTruthy();
  });

  it("should hide the message when close button clicked", () => {
    const toastMessageRef = React.createRef();
    const { queryByText, getByTitle } = render(
      <ToastMessages ref={toastMessageRef}></ToastMessages>
    );
    act(() => {
      toastMessageRef.current["add"]({
        type: "success",
        message: "first message"
      });
    });

    fireEvent.click(getByTitle("Close"));

    expect(queryByText("first message")).toBeFalsy();
  });
});
