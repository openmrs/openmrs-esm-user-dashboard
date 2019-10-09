# Dashboard Architecture

Date: 23-Septemper-2019

## Status

Proposed

## Context

We needs to create a generic dashboard module which need to work with OpenMRS. The dashboard is expected to show dashboard’s based on the Role / Privilege of the logged in user.

## Decision

Dashboard module can be implemented using below 2 important blocks

### 1. Dashboard UI Module

This module is built as OpenMRS OWA module. It will take care of fetching the dashboard configuration based on current user & render the dashboard visually.

### 2. Serving Dashboard config

Dashboard configurations will be served as static files from `frontend` folder of `openmrs-module-spa`.

### 3. Redirecting User to Dashboard

Links to dashboard will be shown to the user in openMRS home page. The dashboard links will be shown based on the user's privileges.

## Consequences

- Migrating to Micro frontend based architecture might take some effort.
- User will be able to see the broken dashboard by manually typing a particular dashboard url.
- Too many app links may be added as extension if we need to show dashboard based on multiple parameters like program, location & role.
