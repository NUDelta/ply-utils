# ply-utils

Back-end application for ply, a research tool designed to help learners understand professional examples of front-end web design techniques.

ply-utils:

- Parses crowdsourced tutorial webpages for web techniques
- Classifies CSS properties as likely relevant, possibly relevant, and likely irrelevant with respect to a technique of interest
- Maintains a database of per-technique classifications

## Getting started

To install ply-utils, clone the repository and install dependencies:

```shell
npm install
```

Start the application:

```shell
npm run start
```

To lint:

```shell
npm run lint
```

To run unit tests:

```shell
npm run test
```

To watch unit tests while developing:

```shell
npm run test:watch
```

## Todo

- [ ] Fix parsing of `<code>` tags nested inside `<pre>` tags
- [ ] Connect to Firebase