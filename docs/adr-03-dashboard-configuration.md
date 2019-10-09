# Dashboard Configuration

Date: 23-Septemper-2019

## Status

Proposed

## Context

Dashboard Engine is to be designed as generic so that implementor can design new dashboard by creating new configuration file.
The schema of the configuration needs to be simple & easy to evolve to adopt the future changes.

## Decision

Dashboard configuration will follow the below schema to define Dashboard layout & widgets.

```
{
  "title": "Sample Dashboard",
  "layout": {
    "columns": 10 //No of columns the dashboard should have. default: 2
  },
  "contents": [
    {
      size: {
        rows:2, // No of rows occupied by widget
        columns:1 // No of columns occupied by widget
      },
      library: {
		      "module": "@openmrs/samlpe-widgets", // module where the widget is available
          "name": "sample" //name of the component. default value: default
      }
      "properties": {
        "propertyKey": "propertyValue"
      }, // custom properties needs to be passed to widget
    },
    {
      size: {
        rows:2,
        columns:1
      },
      library: {
        "module": "@openmrs/dashboard-widgets",
        "name": "todo"
      },
      "properties": {
        "title": "My Todos",
        "api": "api/path/to/get/todos",
        "durationInHours": 24,
        "hideDoneTodos": true
      }
    }
  ]
}
```

## Consequences

- May require tweaks while migrating to MF squad’s new confirmation format (once they have finalised)
