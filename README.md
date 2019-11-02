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

## Features

- Responsive Layout
- User Context
- Breadcrumb
- Toast Messages

## Responsive Layout

Dashboard allows the developers/implementers to configure the layout of dashboard & widgets. They can control the layout at 2 levels.

1. Dashbaord Level

In configuration, you can configure howmany columns you want to have for the dashboard.
By default, dashbaord will contain 2 columns.

### Example

```
{
  ...

  "layout": {
    "columns": 10 //No of columns the dashboard should have. default: 2
  },

  ...
}
```

2. Widget Level

In configuration, you can configure howmany columns & rows a widget can take. By default it will be 1.

```
{
  ...
  "contents": [
    ...
    {
      size: {
        rows:2, // No of rows occupied by widget
        columns:1 // No of columns occupied by widget
      },
    }
    ...
  ]
  ...
}
```

## User Context

Dashboard will set the user related properties as context for the widgets. User context information will be passed as properties for the widgets.

Below user information are avaialble as properties for widgets.

1. uuid
2. locale

## Breadcrumb

Dashboard will show the breadcrumb based on the title of the dashboard.

## Toast Messages

Dashboard allows the widgets to show toast messages when they want to some information to the user. All the widgets will a reference property called `showMessage` which can be called with below signatature to a message to user.

### Sample Usage

```
// sample-widget.tsx

function SampleWidget(props) {
  const showSampleMessage = () =>{
    props.showMessage({type: "success", message: "You clicked the button"});
  };

  return <button onClick={showSampleMessage}>Show Message<button>
}

```

### Supported Message Types

- `success`
- `error`
- `warning`
