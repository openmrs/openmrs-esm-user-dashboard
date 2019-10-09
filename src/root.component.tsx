import React, { useEffect, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-api";
import { useMediaQuery } from "react-responsive";

import WidgetLoader from "./widget-loader.component";
import LoadingStatus from "./model/loading-status";

export default function Root(props: RootProps) {
  const [dashboardConfig, setDashboardConfig] = useState(undefined);
  const [configLoadingStatus, setConfigLoadingStatus] = useState(
    LoadingStatus.Loading
  );
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });

  useEffect(() => {
    let dashboardType = window.location.pathname.split("/").pop();

    openmrsFetch(`/frontend/dashboard-configs/${dashboardType}.json`)
      .then(response => {
        setDashboardConfig(response.data);
        setConfigLoadingStatus(LoadingStatus.Loaded);
      })
      .catch(error => {
        setConfigLoadingStatus(LoadingStatus.Failed);
      });
  }, []);

  function renderDashboard() {
    return (
      <>
        {dashboardConfig.contents.map(widget => {
          return (
            <WidgetLoader
              key={widget.library.module}
              config={widget}
            ></WidgetLoader>
          );
        })}
      </>
    );
  }

  function renderLoadingMessage() {
    return <span className="loading">Loading...</span>;
  }

  function renderErrorMessage(message) {
    return <span className="error">{message}</span>;
  }

  function displayDashboard() {
    switch (configLoadingStatus) {
      case LoadingStatus.Loaded:
        return renderDashboard();
      case LoadingStatus.Loading:
        return renderLoadingMessage();
      default:
        return renderErrorMessage("Unable to load dashboard");
    }
  }

  function getColumnsLayoutStyle(): string {
    let numberOfColumns = 1;
    if (!isTabletOrMobile) {
      numberOfColumns =
        configLoadingStatus === LoadingStatus.Loaded &&
        dashboardConfig.layout &&
        dashboardConfig.layout.columns
          ? dashboardConfig.layout.columns
          : 2;
    }

    return String("1fr ")
      .repeat(numberOfColumns)
      .trimRight();
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div
        style={{ gridTemplateColumns: getColumnsLayoutStyle() }}
        className="dashboard"
      >
        {displayDashboard()}
      </div>
    </div>
  );
}

type RootProps = {};
