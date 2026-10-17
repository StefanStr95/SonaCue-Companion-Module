# companion-module-sonacue

Bitfocus Companion module for [SonaCue](https://sona-cue.com), a macOS live-show
playback app. Talks to SonaCue's OSC control/feedback interface (Settings → OSC)
over UDP — no MIDI routing or IAC bus required.

## What it does

- **Actions**: GO, Stop, Play/Pause, Next Track, Previous Track, Panic, Select
  Track by Index, GO Track by Index, Next / Previous Section, Jump to Section by
  Index, Timecode Chase (Toggle / On / Off), Click (Toggle / On / Off), Show
  Setlist (by number or name; empty = All Cues), Set Mode (Edit/Show).
- **Feedbacks**: `Playing` (button lights up while a track plays), `Current
  Track Is` (highlights the active cue's button), `Current Section Is`, `Mode
  Is` (Edit/Show), `Click On`, `Setlist Is`, `Remaining Time Below` (a
  warning before the cue ends), `Chase On`, `Chase Status Is` (locked /
  freewheel / suspended / no signal / waiting / off), `Link: Main Lost`,
  `Link: Following`, `Playlist Cue Loaded`.
- **Variables**: `playing`, `current_track_name`, `current_track_index`,
  `next_track_name`, `next_track_index`, `mode`, `track_count`, `section_name`,
  `section_index`, `elapsed`, `remaining` (m:ss), `elapsed_seconds`,
  `remaining_seconds`, `setlist_name`, `setlist_index`, `click`, `chase`,
  `chase_status`, `link_role`, `link_status`, `title_name`, `title_index`,
  `title_count` (the title a playlist cue plays).
- **Presets**: ready-made GO/Stop/Next/Previous/Panic/Mode buttons, a "Song N"
  button per known track (drag one per cue and Companion shows which is live),
  Previous/Next Section and "Section N" buttons that light up while the song is
  in that section, a Chase button coloured by its state (green locked, yellow
  freewheel, red suspended — press to resume), a "Now" display with the cue
  and section names, a countdown that turns red for the last 30 seconds, an
  elapsed-time display, a "Next up" display, a Click button lit while the click
  is on, All Cues / Setlist 1–4 buttons lit while their setlist shows, and a
  Link button with the SonaCue Link role and status (green while linked, red
  when a backup has lost its main), and a Playlist Title display (title N/M and
  its name, lit while a playlist cue is loaded).

Sections, panic, chase, click, setlists, the next cue and the time need SonaCue
2.0 or later, the Link status a SonaCue with SonaCue Link, and the playlist title a SonaCue
with playlist cues; with SonaCue 1.5 those buttons simply stay dark.

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
- `/sonacue/panic` — stop everything at once.
- `/sonacue/section/next`, `/sonacue/section/previous` — no args.
- `/sonacue/section/jump i` — section at 1-based index of the playing cue.
- `/sonacue/chase [i]` — 1 on, 0 off, no argument toggles (resumes a
  suspended chase).
- `/sonacue/click [i]` — the selected cue's click: 1 on, 0 off, no argument
  toggles (a 0 within half a second of a 1 is a push button's release).
- `/sonacue/setlist i` / `/sonacue/setlist s` — show setlist i (1-based) or the
  one of that name (as `status/setlist` sends it, "Untitled Setlist"
  included); `/sonacue/setlist/all`, or the name "All Cues" — every cue.

Feedback (SonaCue → Companion, sent to the Feedback Port, only when a value
changes):
- `/sonacue/status/playing i` (0/1)
- `/sonacue/status/track i s` (1-based index, name)
- `/sonacue/status/mode s`
- `/sonacue/status/trackCount i`
- `/sonacue/status/section i s` (1-based section of the playing cue, 0 = none; name)
- `/sonacue/status/chase i s` (0/1; locked, freewheel, suspended, no signal,
  waiting or off)
- `/sonacue/status/link s s` (role: off, main or backup; status — on a main
  waiting or followed, on a backup searching, needspin, connecting, following,
  suspended, ready, denied or mainlost; problem when a main can't listen; off)
- `/sonacue/status/next i s` (what GO plays next; 0 and "" for none)
- `/sonacue/status/title i i s` (a playlist cue's title: its number, the
  list's length, its name; 0, 0 and "" for any other cue)
- `/sonacue/status/setlist i s` (0 and "All Cues" for none)
- `/sonacue/status/click i i` (on; whether the cue has a beat grid)
- `/sonacue/status/time f f i` (elapsed, remaining seconds, to the tenth — up
  to 4× a second while a cue plays, nothing while it stands still — and 1
  while the cue will loop instead of reaching its end)
