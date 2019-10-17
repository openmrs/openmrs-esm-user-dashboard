import React from "react";
import { render, waitForElement, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useMediaQuery as mockUseMediaQuery } from "react-responsive";

import WidgetLoader from "./widget-loader.component";
import { setErrorFilter } from "../utils";

declare var System;

jest.mock("react-responsive", () => ({
  useMediaQuery: jest.fn().mockReturnValue(false)
}));

describe(`<WidgetLoader />`, () => {
  const originalError = console.error;
  const testWidgetConfig = {
    library: { module: "openmrs/test-widget" },
    properties: { title: "Test Widget" }
  };
  const commonUserProps = {
    id: "user-uuid",
    locale: "en_GB"
  };

  beforeAll(() => {
    setErrorFilter(originalError, /Warning.*not wrapped in act/);

    System.import = jest.fn().mockImplementation(module => {
      return module === "openmrs/test-widget"
        ? Promise.resolve({ default: () => <div>Test Widget</div> })
        : Promise.reject(new Error("No module available"));
    });
  });

  afterAll(() => {
    console.error = originalError;
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render Loading message when widget is loading`, () => {
    const { queryByText } = render(
      <WidgetLoader userProps={commonUserProps} config={testWidgetConfig} />
    );

    expect(queryByText("Loading...")).not.toBeNull();
  });

  it(`should render widget dynamically using config`, done => {
    const { queryByText } = render(
      <WidgetLoader userProps={commonUserProps} config={testWidgetConfig} />
    );

    waitForElement(() => queryByText("Test Widget")).then(() => {
      expect(queryByText("Test Widget")).not.toBeNull();
      done();
    });
  });

  it(`should show error message when widget is not available`, done => {
    const { queryByText } = render(
      <WidgetLoader
        userProps={commonUserProps}
        config={{
          library: { module: "openmrs/unavailable-widget" },
          properties: { title: "unavailable widget" }
        }}
      />
    );

    waitForElement(() => queryByText("Unable to load unavailable widget")).then(
      () => {
        expect(queryByText("Unable to load unavailable widget")).not.toBeNull();
        done();
      }
    );
  });

  it(`should render default size when not specified not specified`, () => {
    const { container } = render(
      <WidgetLoader userProps={commonUserProps} config={testWidgetConfig} />
    );

    expect(container.firstChild).toHaveStyle(`grid-row:span 1;`);
    expect(container.firstChild).toHaveStyle(`grid-column:span 1;`);
  });

  it(`should render custom size when specified in config`, () => {
    const { container } = render(
      <WidgetLoader
        userProps={commonUserProps}
        config={{ ...testWidgetConfig, ...{ size: { rows: 2, columns: 2 } } }}
      />
    );

    expect(container.firstChild).toHaveStyle(`grid-row:span 2;`);
    expect(container.firstChild).toHaveStyle(`grid-column:span 2;`);
  });

  it(`should render column size as 1 when it is tablet or mobile`, () => {
    mockUseMediaQuery.mockReturnValue(true);
    const { container } = render(
      <WidgetLoader
        userProps={commonUserProps}
        config={{ ...testWidgetConfig, ...{ size: { rows: 2, columns: 2 } } }}
      />
    );

    expect(container.firstChild).toHaveStyle(`grid-column:span 1;`);
    mockUseMediaQuery.mockReturnValue(false);
  });
});
