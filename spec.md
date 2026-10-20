# Specification

## Experience

**Title:** Moonlit Hollow  
**Format:** Single-screen vertical browser experience  
**Goal:** Reward curiosity with a memorable, friendly supernatural moment that builds interest in a seasonal park visit.

## Scene

The crooked manor is the focal point. Environmental features are the old bell, graveyard, pumpkin patch, moon and clouded sky. Ambient effects include flying bats, drifting clouds, rolling fog, flickering fireflies, glowing moonlight, and a synthesized wind-and-hum loop.

## Phase 1 story: The Lantern Keeper

Trigger order: old bell → blue attic window → striped pumpkin.

1. Beginning: manor windows illuminate and a warm light stirs.
2. Middle: the Lantern Keeper rises, floats forward, and greets the visitor.
3. End: a ring of colored sparks marks the visitor as a friend; the Keeper departs and the scene resets.

The sequence lasts about 7.2 seconds. Other scene controls are disabled during playback except the global pause control. On completion, all trigger progress resets and the story can be replayed.

## Controls and accessibility

- Enter enables audio and animation.
- Calmer Motion is preselected when `prefers-reduced-motion` is active.
- One Play/Pause control suspends Web Audio, CSS animation, hint timing, story timing, and scene interaction.
- Trigger objects are semantic buttons with visible keyboard focus and accessible names.
- Live regions announce hints and story captions.

