import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import LoadingStatus from "../model/loading-status";

export default function WidgetLoader(props: WidgetLoaderProps) {
  const [componentModule, setComponentModule] = useState(undefined);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.Loading);

  const { module, name = "default" } = props.config.library;
  const { size } = props.config;
  const { properties: widgetProps } = props.config;
  const { title = "Control" } = widgetProps;
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });

  useEffect(() => {
    System.import(module)
      .then(module => {
        setComponentModule(module);
        setLoadingStatus(LoadingStatus.Loaded);
      })
      .catch(error => {
        setLoadingStatus(LoadingStatus.Failed);
      });
  }, []);

  function renderWidget() {
    const Component = componentModule[name];
    return <Component {...props.userProps} {...widgetProps} />;
  }

  function renderLoadingMessage() {
    return <span className="loading">Loading...</span>;
  }

  function renderErrorMessage() {
    return <span className="error">Unable to load {title}</span>;
  }

  function displayWidget() {
    switch (loadingStatus) {
      case LoadingStatus.Loaded:
        return renderWidget();
      case LoadingStatus.Loading:
        return renderLoadingMessage();
      default:
        return renderErrorMessage();
    }
  }

  const getWidgetRowSize = () => (size && size.rows ? size.rows : 1);
  const getWidgetColumnSize = () =>
    !isTabletOrMobile && size && size.columns ? size.columns : 1;
  const getWidgetSizeStyle = (): GridSize => ({
    gridRow: `span ${getWidgetRowSize()}`,
    gridColumn: `span ${getWidgetColumnSize()}`
  });

  return (
    <div className="widget-container" style={getWidgetSizeStyle()}>
      {displayWidget()}
    </div>
  );
}

type WidgetLoaderProps = {
  config: {
    size?: {
      rows?: number;
      columns?: number;
    };
    library: {
      module: string;
      name?: string;
    };
    properties: any;
  };
  userProps: any;
};

type GridSize = {
  gridRow: string;
  gridColumn: string;
};
