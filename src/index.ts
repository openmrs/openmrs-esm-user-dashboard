import "./set-public-path";

function setupOpenMRS() {
  return {
    lifecycle: () => import("./openmrs-esm-user-dashboard"),
    activate: /^dashboard/
  };
}

export { setupOpenMRS };
