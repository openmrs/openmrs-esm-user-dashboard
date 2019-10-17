import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Breadcrumb from "./breadcrumb.component";
describe("Breadcrumb", () => {
  it("should show show path with link", () => {
    const { getByText } = render(
      <Breadcrumb paths={[{ name: "Test Path", href: "#" }]}></Breadcrumb>
    );

    expect(getByText("Test Path")).toBeTruthy();
    expect(getByText("Test Path")).toHaveAttribute("href", "#");
  });

  it("should show home icon", () => {
    const { container } = render(
      <Breadcrumb paths={[{ name: "Test Path", href: "#" }]}></Breadcrumb>
    );

    expect(container.getElementsByClassName("icon-home").length).toBe(1);
  });
});
