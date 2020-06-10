import "./set-public-path";

function setupOpenMRS() {
  debugger;
  return {
    lifecycle: () => import("./openmrs-esm-user-dashboard"),
    activate: ""
  };
}

export { setupOpenMRS };
