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
