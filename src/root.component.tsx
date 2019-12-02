import React, { useEffect, useState } from "react";
import { openmrsFetch, getCurrentUser } from "@openmrs/esm-api";
import { useMediaQuery } from "react-responsive";

import WidgetLoader from "./components/widget-loader.component";
import LoadingStatus from "./model/loading-status";
import Breadcrumb, { BreadcrumbPath } from "./components/breadcrumb.component";
import ToastMessages from "./components/toast-messages/index.component";

export default function Root(props: RootProps) {
  const rootConfigPath = "/frontend/dashboard-configs";
  const getProviderByUserUrl = "/ws/rest/v1/provider?user=";
  const [dashboardConfig, setDashboardConfig] = useState(undefined);
  const [configLoadingStatus, setConfigLoadingStatus] = useState(
    LoadingStatus.Loading
  );
  const [loggedInUser, setLoggedInUser] = React.useState(null);
  const [loggedInProvider, setLoggedInProvider] = React.useState(null);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const toastMessageRef = React.createRef();

  const widgetHandles = {
    showMessage(messageDetails) {
      if (toastMessageRef.current["add"]) {
        toastMessageRef.current["add"](messageDetails);
      }
    }
  };

  const isLoggedIn = user => user && user.authenticated;
  const getUserProps = (user, provider) => ({
    id: user.user.uuid,
    locale: user.locale,
    provider: provider.uuid
  });
  useEffect(() => {
    const sub = getCurrentUser({ includeAuthStatus: true }).subscribe(user =>
      setLoggedInUser(user)
    );

    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoggedIn(loggedInUser)) {
      return;
    }

    let dashboardType = window.location.pathname.split("/").pop();
    const configPromise = openmrsFetch(
      `${rootConfigPath}/${dashboardType}.json`
    );
    const providerPromise = openmrsFetch(
      `${getProviderByUserUrl}${loggedInUser.user.uuid}`
    );

    Promise.all([configPromise, providerPromise])
      .then(([configResponse, providerResponse]) => {
        setLoggedInProvider(providerResponse.data.results[0]);
        setDashboardConfig(configResponse.data);
        setConfigLoadingStatus(LoadingStatus.Loaded);
      })
      .catch(error => {
        setConfigLoadingStatus(LoadingStatus.Failed);
      });
  }, [loggedInUser]);

  function renderDashboard() {
    return (
      <>
        {dashboardConfig.contents.map(widget => {
          return (
            <WidgetLoader
              key={widget.library.module}
              config={widget}
              userProps={getUserProps(loggedInUser, loggedInProvider)}
              handles={widgetHandles}
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

  const getDashboardTitle = () =>
    configLoadingStatus == LoadingStatus.Loaded
      ? dashboardConfig.title
      : "My Dashboard";

  const breacrumbPath: BreadcrumbPath = {
    name: getDashboardTitle()
  };

  return (
    isLoggedIn(loggedInUser) && (
      <div className="content dashboard-container">
        <Breadcrumb paths={[breacrumbPath]}></Breadcrumb>
        <div
          style={{ gridTemplateColumns: getColumnsLayoutStyle() }}
          className="dashboard"
        >
          {displayDashboard()}
        </div>
        <ToastMessages ref={toastMessageRef}></ToastMessages>
      </div>
    )
  );
}

type RootProps = {};
