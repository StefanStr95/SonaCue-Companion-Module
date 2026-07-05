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

## SonaCue-side setup

In SonaCue, open **Settings (⌘,) → OSC**:

1. **OSC Control** — enable "Receive OSC Commands", note the **Listen Port**
   (default `53000`).
2. **OSC Feedback** — enable "Send Status Feedback", set **Host** to the
   machine running Companion (`127.0.0.1` if it's the same Mac) and note the
   **Feedback Port** (default `53001`).

## Companion-side setup

1. Add a new connection → search "SonaCue".
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
yarn package  # builds a .tgz for sideloading via Companion's Developer settings
```

To test locally before publishing, add this module's path under Companion's
**Settings → Developer → Developer modules path** and restart Companion.

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
