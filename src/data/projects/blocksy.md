Blocksy is an experimental <mark>grid-based puzzle game</mark> in which the player guides a small character through dungeon-like levels. Instead of directly controlling every movement, the player reshapes the route by selecting square regions of the board and rotating them. Gravity then takes over, turning each move into a decision about where the character, platforms and hazards will end up.

## Rotate the level to find a path

Each level is built on an **11 by 11 grid**. The player can drag across a square area and rotate its movable contents by 90 degrees. The game pauses gravity during the animated rotation, moves the affected entities around the selected center and then resumes the simulation in the new layout.

- Choose a square region containing at least **2 by 2 tiles**.
- Work around fixed walls and other elements that cannot be rotated.
- Use **slopes and conveyors** to influence the character's movement.
- Avoid lethal tiles and guide the character into the animated exit.

## Physics built for changing geometry

Rotating part of a level means the physics cannot treat the map as a static backdrop. I built the game around a compact <mark>entity-component-system</mark> that updates gravity, velocity, friction, effects, collisions, rotation and rendering as separate systems. The player uses a circular collider against polygonal blocks, including rotated slopes, so collision behavior follows the transformed level geometry.

## Levels, progress and scoring

Levels are authored as LDtk maps and converted into the game's block model. The map format can place spawn points, walls, slopes, conveyors, hazards and exits while keeping level design separate from the runtime.

- A **level-select scene** exposes progress through completed stages.
- The score decreases with each rotation, rewarding solutions that use fewer moves.
- Local save data keeps the best score and move count for each finished level.
- Victory, failure, restart and settings flows are handled as part of the game rather than debug-only screens.

## PHP driving raylib directly

The entire game loop runs as a <mark>PHP 8.3 desktop process</mark>. PHP FFI loads raylib's native API directly for the window, input, textures, audio, render targets and shaders. There is no web server and no separate language bridge between the game code and the rendering library, which makes the project a practical test of PHP outside its usual web application role.

## Pixel presentation and feedback

The scene is rendered to an off-screen texture before post-processing. A dither pass establishes the pixel-art look, while an optional <mark>CRT shader</mark> adds time-based screen distortion. The interface also includes a custom cursor, tweened menu states, music and sound effects for moves, victory, failure and navigation.

## How I built it

I designed and implemented the game concept, rotation mechanic and level flow in PHP. I also built the FFI binding layer, entity-component architecture, movement and collision systems, LDtk map conversion, resource loading, shaders, audio, menus, scoring and saved progress. The result is a complete playable experiment driven by PHP and raylib from the main loop through to rendering and persistence.
