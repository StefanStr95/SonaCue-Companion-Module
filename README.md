# companion-module-sonacue

Bitfocus Companion module for [SonaCue](https://sona-cue.com), a macOS live-show
playback app. Talks to SonaCue's OSC control/feedback interface (Settings → OSC)
over UDP — no MIDI routing or IAC bus required.

## What it does

- **Actions**: GO, Stop, Play/Pause, Next Track, Previous Track, Select Track by
  Index, GO Track by Index, Set Mode (Edit/Show).
- **Feedbacks**: `Playing` (button lights up while a track plays), `Current
  Track Is` (highlights the active cue's button), `Mode Is` (Edit/Show).
- **Variables**: `playing`, `current_track_name`, `current_track_index`, `mode`,
  `track_count`.
- **Presets**: ready-made GO/Stop/Next/Previous/Mode buttons, plus a "Song N"
  button per known track (drag one per cue and Companion shows which is live).

## Installing this module

This module isn't in Companion's built-in module store yet (that requires a
separate submission/review with Bitfocus — see "Getting into the official
store" below). Until then, install it from a downloaded package — no
Developer mode needed:

1. Download the latest `sonacue-X.Y.Z.tgz` from this repo's
   [Releases page](https://github.com/StefanStr95/SonaCue-Companion-Module/releases).
2. In Companion, open the **Modules** page and use its **Import module
   package** option, then select the downloaded `.tgz`.
3. Companion now lists "SonaCue" as an installed module — add a connection
   for it as usual (see "Companion-side setup" below).

(The exact wording of the import option can vary slightly between Companion
versions — look for "Import" on the Modules page if it's phrased differently.)

## SonaCue-side setup

In SonaCue, open **Settings (⌘,) → OSC**:

1. **OSC Control** — enable "Receive OSC Commands", note the **Listen Port**
   (default `53000`).
2. **OSC Feedback** — enable "Send Status Feedback", set **Host** to the
   machine running Companion (`127.0.0.1` if it's the same Mac) and note the
   **Feedback Port** (default `53001`).

## Companion-side setup

1. Add a new connection → search "SonaCue" (it appears once installed, see
   "Installing this module" above).
2. **SonaCue Host** = the IP SonaCue is running on.
3. **Command Port** = SonaCue's OSC *Listen Port* (matches step 1 above —
   Companion sends commands here).
4. **Feedback Port** = SonaCue's OSC *Feedback Port* (matches step 2 above —
   this module listens here for status).
5. Drag presets from the **Presets** tab onto Stream Deck buttons, or build
   your own with the actions/feedbacks above.

## Development

```bash
yarn install
yarn format   # prettier
yarn package  # builds sonacue-X.Y.Z.tgz — the file end users import (see above)
```

To iterate locally without repackaging on every change, add this module's
*parent* directory (not the module folder itself) under Companion's
**Settings → Developer → Developer modules path** and restart Companion —
Companion scans every subfolder of that path for a `companion/manifest.json`.

## Getting into the official Companion module store

Not done yet. Every existing third-party module lives under the
`bitfocus/companion-module-*` GitHub org rather than the author's own
account, which suggests listing requires a submission/hand-off to Bitfocus
rather than an open PR against a public registry — the exact process isn't
documented in enough detail to follow without confirming with them directly
(their [Slack](https://companion.free) or an issue on
[bitfocus/companion](https://github.com/bitfocus/companion)). Until that
happens, use the packaged `.tgz` install above.

## Wire protocol

See `CLAUDE.md` in the [SonaCue repo](https://github.com/StefanStr95/SonaCue)
(`OSCController.swift`) for the authoritative address schema. Summary:

Commands (Companion → SonaCue, sent to the Command Port):
- `/sonacue/go`, `/stop`, `/playPause`, `/next`, `/previous` — no args.
- `/sonacue/track/select i` — select track at 1-based index.
- `/sonacue/track/go i` — select and fire track at 1-based index.
- `/sonacue/mode s` — `"edit"` or `"show"`.

Feedback (SonaCue → Companion, sent to the Feedback Port, only on real
transport/selection changes):
- `/sonacue/status/playing i` (0/1)
- `/sonacue/status/track i s` (1-based index, name)
- `/sonacue/status/mode s`
- `/sonacue/status/trackCount i`
