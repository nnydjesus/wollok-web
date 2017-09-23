#README

Wollok-Web is using some of the latest web technologies: React, Webpack, Express, Babel, Sass, and others.

## How do I get set up? ##

###Run the app
`npm start`

Starts an Express web server pointing to public/index.html in port 9990. Starts Webpack in watch mode as an Express middleware, serving bundled content from <host>:9990/dist.

###Run Webpack in dev mode
`npm run dev`

Starts a Webpack Dev Server in watch mode in port 8089.

###Run a Dev build
`npm run build-dev`

Runs Webpack to generate a Development mode bundle.

###Run a Prod build
`npm run build-prod`

(TODO) Runs Webpack to generate a Production mode bundle.