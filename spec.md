# Specification

## Experience

**Title:** Moonmoss Hollow
**Format:** Single-screen vertical browser experience  
**Audience and tone:** Friendly, gently spooky Halloween discovery for curious
visitors ages 10+.

Visitors choose one of three tales, then find the lantern, owl, and gate in
that order. Completing the sequence plays the chosen story. The clues reset at
the end so the visitor can replay the tale; a **Choose another tale** control
returns them to the welcome screen to change stories.

## Scene

The moonlit observatory is the focal point. The scene includes a graveyard,
pond, gate, pumpkin patch, moon, distant firs, fireflies, and drifting leaves.
The illustrations are original SVG artwork.

## Stories

- **The Lantern Keeper:** a warm light wakes beneath the observatory and the
  Keeper thanks the visitor for finding the watchers.
- **The Graveyard Promise:** a shy ghost remembers its promise and reunites
  with friends by the gate.
- **The Moon's Lost Song:** the watchers remember three notes and help the
  moon sing again.

Each story uses a timed sequence of accessible captions and a matching
animated apparition.

## Controls and accessibility

- Enter enables the experience; audio begins only after this user gesture.
- The story is selected with a labeled native select control.
- The watcher targets support pointer, Enter, and Space input and have
  accessible names.
- The selected story is announced in a live region as it plays.
- A single Play/Pause control suspends story timing and Web Audio.
- The operating system's reduced-motion preference minimizes ambient motion;
  the story remains visible without its animation.
- Focus indicators, touch-sized welcome controls, and visible progress support
  use across devices.
