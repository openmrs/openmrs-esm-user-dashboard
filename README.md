# Dashboard

ESM Package serves as an engine for rendering dashboard widgets based on the configuration served.

## Pre-Requesties

NodeJS

## How to Setup?

- Run `npm install` to install all the dependencies
- Run `npm start -- --https --port 8082` to start application in dev mode.
- If you are using with OpenMRS Micro Frontend, update/add the port:url in `import-map.json` file of `openmrs-esm-root-config`.
- Run `npm run build` for production build.

## Dashboard Configuration Schema

Refer [Architecture Decision Record](docs/adr-03-dashboard-configuration.md) for more details about configuration schema.

## Architecture Decision Records

Architecture decision records are available under `docs` folder.
