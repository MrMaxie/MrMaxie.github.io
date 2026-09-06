**I built** office-3ds to turn a <mark>Nintendo 3DS</mark> into a compact office dashboard. It brings dashboard data onto the handheld through a native application, giving the console a use beyond games. You can use the simple dashboard or customize its appearance, content and connection to your own API.

## An office dashboard on a handheld

The dashboard runs <mark>directly on the Nintendo 3DS</mark>. Its C++ interface presents data fetched from the configured backend, so the console is both the display and the API client. Once connected, it communicates directly with that API to retrieve the information the dashboard needs.

## Make the dashboard your own

<mark>Customization</mark> lets you adapt the dashboard while keeping the native console application as its foundation. A Lua package describes what the application should present and where its data comes from.

- **Appearance:** configure presentation and supply your own assets.
- **Content:** select the response data that appears in the dashboard.
- **API integration:** define backend operations, with a C++ adapter available for more specialized behavior.

## From Lua to C++

A dashboard is described by a versioned Lua package containing its presentation, assets and backend operations. A native build tool validates that package and generates the C++ integration. <mark>Lua is a build-time input</mark>: the console runs the generated C++ code rather than embedding a Lua runtime.

## Reusable API adapters

The generated adapter handles requests and selects the response data the dashboard needs. Where a product requires custom orchestration or a different wire format, it can supply an <mark>explicit C++ adapter</mark>. This keeps the common transport and console code reusable while leaving room for product-specific behavior.

## Connection and credentials

A protected, <mark>single-use claim</mark> transfers a runtime credential to the console, after which the client talks directly to the API. Credentials are kept out of generated product code, and the build tooling constrains product paths and the capabilities available to Lua packages.

## How I built it

I built the <mark>native C++ dashboard</mark>, connected it to the API and implemented the tools used to customize and build the application.

- **Console application:** implemented the dashboard interface and API integration.
- **Customization tooling:** built package validation and C++ code generation.
- **Build pipeline:** separated code generation on the development machine from cross-compilation for Nintendo 3DS.
