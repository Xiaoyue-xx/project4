# Design rationale

## Audience and tone

The experience uses a moonlit setting, quiet silhouettes, curious clues, and
gentle magical payoffs to keep the Halloween mood friendly rather than
frightening.

## Interaction

- A single ordered sequence makes the three discoveries legible without
  introducing separate controls for each story.
- Story choice happens before entering the scene; the play area stays focused
  on discovery.
- Each correct discovery advances visible progress and updates the clue.
- Every story resets the clues after its ending, supporting replay.
- Original Web Audio synthesis starts after the visitor presses Enter, in
  keeping with browser audio autoplay restrictions.
- A reduced-motion preference minimizes ambient movement and leaves the story
  apparition visible without animation.

## Asset and licensing decision

The scene, story apparitions, and effects are original inline SVG and CSS.
Audio tones and ambient sound are synthesized at runtime with the Web Audio
API. No external images, audio recordings, or fonts are loaded.

## Playtest status

The design rationale is not evidence of user testing. Peer observations,
resulting revisions, and physical-device verification must be added to
`playtest-notes.md` after those activities occur.

