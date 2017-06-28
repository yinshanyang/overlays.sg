# `redux-module-template`

# Table of Contents
1. [Requirements](#requirements)
1. [Project Setup](#project-setup)
	1. [Libraries](#libraries)
	1. [Structure](#structure)
1. [Basic Usage](#basic-usage)
1. [Design Principles](#design-principles)
	1. [Components](#components)
	1. [Reducers and State](#reducers-and-state)
	1. [AJAX and Side Effects](#ajax-and-side-effects)

## Requirements
- node `^4.5.0`
- yarn `^0.17.0` or npm `^3.0.0`

## Project Setup

### Libraries

Transpile:
- Babel

Lint:
- ESLint

Bundle:
- Webpack

Automate:
- Webpack

Typecheck:
- Flow

Test:
- AVA
- Enzyme
- Sinon

Application:
- React
- Reselect
- Redux
- Redux Observable
- RxJS
- Mapbox GL
- D3

### Structure

```
.
├── dist/                   # compiled files for distribution as an npm package
├── example/                # compiled files as a standalone interactive module
└── src/
    ├── app/                # files to wrap and present the module as it can be served by dev-server or compiled with build-example
    │   ├── index.js
    │   └── styles.scss
    ├── lib/                # core source files for the module
    │   ├── components/     # presentational components
    │   ├── config/         # static configuration files
    │   ├── containers/     # container components
    │   ├── reducers/       # reducers and state
    │   │   └── data.js     # API data related reducers and state, much AJAX lives here
    │   │   └── index.js    # essentially a table of contents for reducers and their actions
    │   │   └── state.js    # application related state
    │   ├── utils/          # various self-contained pure functions
    │   ├── index.js
    │   └── styles.scss
    └── index.js            # entry point, handles hot reload
```

## Basic Usage

```
# install dependencies
npm install

# run watcher to monitor file changes and execute test cases automatically
npm run test

# run test once and produce coverage output
npm run coverage

# run webpack-dev-server for development
npm run dev

# compile source code in ./src/lib to ./dist for production-ready version for distribution
npm run build

# compile source code in ./src/app and ./src/lib to ./example for standalone interactive module
npm run build-example
```

## Design Principles

Similar to [`ds-redux-project-template`](https://github.com/dataspark-ui/ds-redux-project-template), we utilise the concept of *presentational & container components* to bring structure to our visual and interactive components.

For state management, similar to `ds-redux-project-template`, we rely on `redux` and `reselect`, though the basis of the implementation differs from `ds-redux-project-template` in the sense that we have taken a *sub-app* approach (see [Isolating Redux Sub-Apps](http://redux.js.org/docs/recipes/IsolatingSubapps.html)), modules have isolated state objects and reducers.

On handling AJAX interactions, we have chosen to utilise `redux-observable` and `rxjs` over `redux-thunk`, for its affordance to provide clarity and structure.

### Components

Presentational and container components are covered in [`ds-ui-study-guide`](https://github.com/dataspark-ui/ds-ui-study-guide#level-1-components).

### Reducers and State

Inside of `~/src/lib/reducers/` one would find the following files:

- `index.js`: essentially a table of contents
- `state.js`: application state lives here
- `data.js`: data that comes back from the APIs live here

> The general rule of thumb is that `state` interacts with the user, while `data` interacts with the API.

`state.js` and `data.js` are written in a [Redux Ducks](https://github.com/erikras/ducks-modular-redux) fashion, so that they are self-contained files and don’t require us to switch contexts as often during development.

More on reducers, state and Redux Ducks can be found in [`ds-ui-study-guide`](https://github.com/dataspark-ui/ds-ui-study-guide#level-3-reducers-redux-and-application-state).

### AJAX and Side Effects

> A function or expression is said to have a side effect if apart from returning a value, it interacts with (reads from or writes to) external mutable state.

With respect to this definition, interacting with an API through AJAX is said to have side effects. It has been a deliberate choice to utilise `redux-observable` and `rxjs` to handle such interactions.

Whilst the learning curve is steep with regards to `rxjs`, what it affords us is a level of clarity in expressing our interactions with the APIs. (see [`ds-ui-study-guide`](https://github.com/dataspark-ui/ds-ui-study-guide#level-4-reducers-rxjs-and-side-effects))

```
// state.js
export const requestData = (action$, state) =>
  action$
    .filter(({ type }) => [SET_INITIAL_STATE, SET_SUB, SET_FILTERS].includes(type))
    .map(() => state.getState().state)
    .filter(validateDataRequest)
    .map((state) => ({ type: FETCH_DATA, state }))
```

```
// data.js
export const fetchData = (action$, state) =>
  action$
    .ofType(FETCH_DATA)
    .map(({ state }) => state)
    .map(composeDataRequest)
    .switchMap((request) =>
      ajax({
        ...request,
        timeout: MINUTE_IN_MILLISECONDS  // timeout can also be defined inside of `composeDataRequest`
      })
        .map(({ response }) => response)
        .map(parseDataResponse)
        .map((data) => ({ type: LOADED_DATA, data }))
        .takeUntil(
          action$.ofType(FETCH_DATA)
        )
        .catch(({ message, status }) =>
          Observable.of({
            type: SET_ERROR,
            error: `Status ${status}: ${message}`
          })
        )
    )
```

The key functions in the code sample above are:

- `validateDataRequest`: based on the application state, checks if a valid request can be constructed, if not, toss the action away
- `composeDataRequest`: based on the application state, compose a request object to pass to `Rx.Observable.ajax` to make the API call, the application state should contain all the necessary components to make any API request
- `parseDataResponse`: parse and format the response from the API into a shape that we are happy to consume

Other interesting sections of this code sample include:

```
.takeUntil(
  action$.ofType(FETCH_DATA)
)
```

This code section handles cancelling an AJAX request. In this case, we cancel the current AJAX request when the same action is called again.

```
.catch(({ message, status }) =>
  Observable.of({
    type: SET_ERROR,
    error: `Status ${status}: ${message}`
  })
)
```

This section deals with error handling.

**Note:** The `state.getState()` inside of epics/`redux-observable` always happens after `redux` has handle the action through the reducer.
