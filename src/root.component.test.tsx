import React from "react";
import { render, waitForElement, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useMediaQuery as mockUseMediaQuery } from "react-responsive";
import { of } from "rxjs";

import Root from "./root.component";
import { setErrorFilter } from "./utils";
import mockEsmAPI from "@openmrs/esm-api";

jest.mock("react-responsive", () => ({
  useMediaQuery: jest.fn().mockReturnValue(false)
}));

const mockUser = {
  authenticated: true,
  locale: "en_GB",
  user: {
    uuid: "uuid",
    display: "admin",
    person: { uuid: "uuid", display: "Test User" },
    privileges: [],
    roles: [{ uuid: "uuid", display: "System Developer" }]
  }
};
const mockDashboardConfig = {
  data: {
    title: "test-dashboard",
    breadcrumbs: [
      {
        name: "receptionist",
        href: "openmrs/spa/dashboard/dashboard/receptionist"
      },
      {
        name: "View All"
      }
    ],
    contents: [
      {
        library: {
          module: "mock-widget"
        },
        properties: {
          title: "Test mock-widget"
        }
      }
    ]
  }
};

const mockProviderResponse = {
  data: {
    results: [
      {
        uuid: "test-provider-uuid"
      }
    ]
  }
};

jest.mock("@openmrs/esm-api", () => ({
  openmrsFetch: jest.fn().mockResolvedValueOnce(mockDashboardConfig),
  getCurrentUser: jest.fn().mockImplementation(() => ({
    subscribe: () => {
      return { unsubscribe: () => {} };
    },
    unsubscribe: () => {}
  }))
}));

declare var System;

describe(`<Root />`, () => {
  const originalError = console.error;

  beforeAll(() => {
    setErrorFilter(originalError, /Warning.*not wrapped in act/);
    mockEsmAPI.getCurrentUser.mockImplementation(() => of(mockUser));
    System.import = jest
      .fn()
      .mockImplementation(moduleName =>
        Promise.resolve({ default: () => <div>Test {moduleName}</div> })
      );
  });

  afterEach(() => {
    mockEsmAPI.openmrsFetch.mockReset();
    cleanup();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it(`renders Root without dying`, () => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce(mockDashboardConfig);

    const { queryByText } = render(<Root />);
    expect(queryByText("Loading...")).not.toBeNull();
  });

  it(`should show breadcrumb from config`, done => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce(mockDashboardConfig);
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce(mockProviderResponse);

    const { queryByText } = render(<Root />);

    waitForElement(() => queryByText("receptionist")).then(() => {
      expect(queryByText("receptionist")).toHaveAttribute(
        "href",
        "openmrs/spa/dashboard/dashboard/receptionist"
      );
      done();
    });
  });

  it(`should render widget from config`, done => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce(mockDashboardConfig);
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce(mockProviderResponse);

    const { queryByText } = render(<Root />);

    waitForElement(() => queryByText("Test mock-widget")).then(() => {
      expect(queryByText("Test mock-widget")).not.toBeNull();
      done();
    });
  });

  it(`should show error message when unable to fetch dashboard config.`, done => {
    mockEsmAPI.openmrsFetch.mockReturnValue(
      Promise.reject(new Error("Unexpected error"))
    );

    const { queryByText } = render(<Root />);

    waitForElement(() => queryByText("Unable to load dashboard")).then(() => {
      expect(queryByText("Unable to load dashboard")).not.toBeNull();
      done();
    });
  });

  it(`should show error message when unable to fetch provider information.`, done => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce(mockDashboardConfig);
    mockEsmAPI.openmrsFetch.mockReturnValue(
      Promise.reject(new Error("Unexpected error"))
    );

    const { queryByText } = render(<Root />);

    waitForElement(() => queryByText("Unable to load dashboard")).then(() => {
      expect(queryByText("Unable to load dashboard")).not.toBeNull();
      done();
    });
  });

  it(`should render grid template frame as 1fr when it is tablet or mobile`, done => {
    mockUseMediaQuery.mockReturnValue(true);
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce(mockDashboardConfig);
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce(mockProviderResponse);

    const { container, queryByText } = render(<Root />);

    waitForElement(() => queryByText("Test mock-widget")).then(() => {
      expect(container.getElementsByClassName("dashboard")[0]).toHaveStyle(
        `grid-template-columns: 1fr;`
      );
      mockUseMediaQuery.mockReturnValue(false);
      done();
    });
  });
});
