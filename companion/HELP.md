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

GO · Stop · Play/Pause · Next Track · Previous Track · Select Track by Index ·
GO Track by Index · Set Mode (Edit/Show)

## Feedbacks

Playing · Current Track Is · Mode Is

See the module's README for the full OSC address schema.
