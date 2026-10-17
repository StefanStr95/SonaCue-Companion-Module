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
Index · Timecode Chase (Toggle / On / Off) · Click (Toggle / On / Off) · Show
Setlist (number or name; empty = All Cues) · Set Mode (Edit/Show)

Chase "On" and "Toggle" resume a chase that SonaCue suspended after an Escape,
Stop or Panic. In a locked show, chase can only be resumed, not switched.

## Feedbacks

Playing · Current Track Is · Current Section Is · Mode Is · Click On ·
Setlist Is · Remaining Time Below (seconds) · Chase On · Chase Status Is
(locked, freewheel, suspended, no signal, waiting, off) · Link: Main Lost ·
Link: Following · Playlist Cue Loaded

## Variables

`playing`, `current_track_name`, `current_track_index`, `next_track_name`,
`next_track_index`, `track_count`, `mode`, `section_name`, `section_index`,
`elapsed`, `remaining` (m:ss), `elapsed_seconds`, `remaining_seconds`,
`setlist_name`, `setlist_index`, `click`, `chase`, `chase_status`, `link_role`,
`link_status`, `title_name`, `title_index`, `title_count` (the playlist cue's
title)

Sections, panic, chase, click, setlists, the next cue and the time need SonaCue
2.0 or later; the Link status needs a SonaCue with SonaCue Link, the playlist title a SonaCue
with playlist cues.
