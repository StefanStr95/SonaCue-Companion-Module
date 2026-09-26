# SonaCue

Controls [SonaCue](https://sona-cue.com) — a QLab-style macOS live-show
playback app — over OSC.

## Setup

In SonaCue: **Settings (⌘,) → OSC** → enable "Receive OSC Commands" (note the
Listen Port) and "Send Status Feedback" (set Host = this machine, note the
Feedback Port).

In this connection's config: set **SonaCue Host**, **Command Port** = SonaCue's
Listen Port, **Feedback Port** = SonaCue's Feedback Port.

## Actions

GO · Stop · Play/Pause · Next Track · Previous Track · Panic · Select Track by
Index · GO Track by Index · Next Section · Previous Section · Jump to Section by
Index · Timecode Chase (Toggle / On / Off) · Set Mode (Edit/Show)

Chase "On" and "Toggle" resume a chase that SonaCue suspended after an Escape,
Stop or Panic. In a locked show, chase can only be resumed, not switched.

## Feedbacks

Playing · Current Track Is · Current Section Is · Mode Is · Chase On ·
Chase Status Is (locked, freewheel, suspended, no signal, waiting, off)

## Variables

`playing`, `current_track_name`, `current_track_index`, `track_count`, `mode`,
`section_name`, `section_index`, `chase`, `chase_status`

Section and chase feedback need SonaCue 2.0 (beta) or later.
