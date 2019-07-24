# kaos-api

You want to edit and create YAML files within the `definition` directory. All files that exist there will be merged into a single file, `openapi.json` at the project root directory. This built file can be used to produce Open API documentation.

To run the build once: `npm run build`

To run the build continually while you develop: `npm run watch`

Once changes to the `openapi.json` files are pushed to the master branch then you can see the docs at: https://gi60s.github.io/kaos-api/