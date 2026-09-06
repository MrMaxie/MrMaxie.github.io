I developed a <mark>real-time 3D mapping platform</mark> that presents large spatial datasets directly in the browser. Users can explore detailed terrain and data layers, work with live elements placed on the map and see changes made by other people as they happen.

## GPU-rendered 3D map

The browser renders the map through the GPU, with a set of **custom shaders** responsible for complex surfaces and visual effects. The rendering pipeline adjusts the level of detail (LOD) so nearby areas retain useful detail while distant geometry remains efficient to draw.

- **LOD-aware geometry:** adapt visible detail to distance and the current view.
- **Custom shader pipeline:** render complex planes and map-specific visual effects on the GPU.
- **Browser-based 3D:** keep navigation and data exploration responsive without a native client.

## High-throughput map delivery

I built a custom cache for the high-performance proxy serving map elements. The cache follows the same <mark>LOD hierarchy</mark> as the rendered data, allowing repeated requests for the relevant level of detail to be resolved quickly while keeping data delivery aligned with the current view.

## Live collaborative map

Map elements are interactive and update live for multiple users working at the same time. Real-time synchronization keeps shared state current, while WebRTC and WebSockets support direct communication and continuous updates between participants.

## Granular permissions

Access is controlled through a **complex permission matrix**. It determines which data and actions are available to each user across the platform, and applies the same rules to map activity, shared changes and live collaboration.

## How I built it

I developed the TypeScript client, Rust services and C# backend. I implemented the GPU rendering and shader work, the LOD-aware map pipeline, the proxy cache, live multi-user synchronization, communication channels and permission enforcement as connected parts of one spatial platform.
