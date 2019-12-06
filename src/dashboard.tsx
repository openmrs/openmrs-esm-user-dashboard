import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";
import "./global.css";
import "./set-public-path";
import { setFetchInterceptor } from "./utils";

setFetchInterceptor();

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
