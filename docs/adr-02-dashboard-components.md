# Dashboard Components

Date: 11-Septemper-2019

## Status

Proposed

## Context

There is a need for creating a generic dashboard engine in OpenMRS. As there are some existing dashboards like patient dashboard which are tightly coupled with the implementation.

Creating a generic compose-able dashboard is necessary helps the OpenMRS developers & implementers to compose their required dashboard easily.

## Decision

Dashboard can be composed of 2 main parts.

### 1. Dashboard Engine

This can be built as an ESM package which accepts the dashboard configuration (in JSON format) as JSON or promise which resolves as JSON. Based on the provided configuration, the engine initialises the dashboard by downloading & rendering the widgets in given position.

Widgets may be already bundled with the deployment or it can be served from CDN or equivalent.

### 2. Widget

Widgets are standalone unit which receives the configurations from dashboard engine. Widget is sole responsible for fetching its data & presenting it in UI.
Widget can be a separate ESM package or many widgets can be bundled in single ESM package.

## Consequences

- Multiple widgets needs to be maintained as widgets.
- Widgets may be duplicated due to lesser visibility to others.
