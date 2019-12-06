import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";

export function setErrorFilter(originalError, errorToFilter: RegExp) {
  //Todo: Upgrade to React Dom 16.9 to avoid below workaround to resolve "act" false positive
  console.error = (...args) => {
    if (errorToFilter.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
}

export const renderWithAct = component => {
  let wrapper;
  act(() => {
    wrapper = render(component);
  });
  return wrapper;
};

export function setFetchInterceptor() {
  let oldFetch = window.fetch;

  window.fetch = (function() {
    return function() {
      let result = oldFetch.apply(this, arguments);
      result.then(res => {
        if (res.status == 401 || res.status == 403) {
          window.location.assign(
            "/openmrs/appui/header/logout.action?successUrl=openmrs"
          );
        }
      });
      return result;
    };
  })();
}
