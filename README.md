# Moonmoss Hollow — Project 4 Phase 2

A phone-first, single-screen Halloween storybook made with HTML, CSS, SVG, and
JavaScript. Visitors find three night-watchers in the hollow to hear one of
three short tales: **The Lantern Keeper**, **The Graveyard Promise**, or
**The Moon's Lost Song**.

## Run locally

Open `index.html` in a modern browser, or serve the deployable files:

```sh
python3 -m http.server 4173 --directory dist
```

Then visit `http://localhost:4173`. The intended layout is a portrait phone
screen; desktop browsers show the same phone-sized composition.

## Play

Choose a tale on the welcome screen and enter the hollow. Find the lantern,
then the owl, then the little gate. The story plays when all three are found;
after it ends, the clues reset so the story can be replayed. Select **Choose
another tale** to return to the welcome screen and choose a different story.
Use the Pause control to stop the scene and story, and use the browser/device
reduced-motion setting to minimize ambient animation.

## Project files

- `index.html`, `style.css`, `app.js`: editable application source.
- `dist/`: static files used by the configured host.
- `spec.md`, `plan.md`, `research.md`: project design and process documents.
- `playtest-notes.md`, `debrief.md`: peer testing and final reflection forms.
- `.openai/hosting.json`: static hosting configuration.

## Repository

Public GitHub repository: <https://github.com/Xiaoyue-xx/project4>

## Credits

- Concept, writing, original SVG scene, interaction, animation, and synthesized
  audio: Xiaoyue, with OpenAI Codex assistance (2026).
- Visual artwork: original inline SVG and CSS; no external image assets.
- Audio: generated in real time with the Web Audio API; no external audio
  assets.
- Typography: system fonts and Georgia; no external font assets.

## Preparing the submission

Record actual peer sessions and complete the forms in `playtest-notes.md` and
`debrief.md`; do not submit the blank form as evidence of completed playtesting.
Before making a repository ZIP, refresh the tracked Git history listing:

```sh
git --no-pager log --oneline --decorate --all > git-log.txt
```

Include `git-log.txt` in the ZIP along with the project files. The repository
is public, but a hosted app URL is not available yet. Enable GitHub Pages for
this repository or publish `dist/` with the configured hosting provider, then
add the working app URL to the submission materials.
