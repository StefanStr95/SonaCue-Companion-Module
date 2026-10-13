/** Seconds as m:ss, or h:mm:ss from an hour on. Remaining time is rounded up,
 * elapsed down, by the caller choosing `Math.ceil`/`Math.floor` — here it is
 * whole seconds as given. */
function formatTime(seconds, round = Math.floor) {
	const total = Math.max(0, round(Number(seconds) || 0))
	const h = Math.floor(total / 3600)
	const m = Math.floor((total % 3600) / 60)
	const s = String(total % 60).padStart(2, '0')
	return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`
}

module.exports = function (self) {
	self.setVariableDefinitions([
		{ variableId: 'playing', name: 'Playing (Yes/No)' },
		{ variableId: 'current_track_name', name: 'Current Track Name' },
		{ variableId: 'current_track_index', name: 'Current Track Index (1-based)' },
		{ variableId: 'next_track_name', name: 'Next Track Name (what GO plays next)' },
		{ variableId: 'next_track_index', name: 'Next Track Index (1-based, 0 = none)' },
		{ variableId: 'mode', name: 'Mode (edit/show)' },
		{ variableId: 'track_count', name: 'Track Count' },
		{ variableId: 'section_name', name: 'Current Section Name' },
		{ variableId: 'section_index', name: 'Current Section Index (1-based, 0 = none)' },
		{ variableId: 'elapsed', name: 'Elapsed Time (m:ss)' },
		{ variableId: 'remaining', name: 'Remaining Time (m:ss)' },
		{ variableId: 'elapsed_seconds', name: 'Elapsed Time (seconds)' },
		{ variableId: 'remaining_seconds', name: 'Remaining Time (seconds)' },
		{ variableId: 'setlist_name', name: 'Setlist Showing ("All Cues" for none)' },
		{ variableId: 'setlist_index', name: 'Setlist Index (1-based, 0 = All Cues)' },
		{ variableId: 'click', name: 'Click of the Selected Cue (On/Off/No grid)' },
		{ variableId: 'chase', name: 'Chase (On/Off)' },
		{ variableId: 'chase_status', name: 'Chase Status (locked, freewheel, suspended, no signal, waiting, off)' },
	])

	self.setVariableValues({
		playing: self.playing ? 'Yes' : 'No',
		current_track_name: self.currentTrackName,
		current_track_index: self.currentTrackIndex,
		next_track_name: self.nextTrackName,
		next_track_index: self.nextTrackIndex,
		mode: self.mode,
		track_count: self.trackCount,
		section_name: self.currentSectionName,
		section_index: self.currentSectionIndex,
		elapsed: formatTime(self.elapsed),
		remaining: formatTime(self.remaining, Math.ceil),
		elapsed_seconds: Math.floor(self.elapsed || 0),
		remaining_seconds: Math.ceil(self.remaining || 0),
		setlist_name: self.setlistName,
		setlist_index: self.setlistIndex,
		click: !self.clickAvailable ? 'No grid' : self.clickOn ? 'On' : 'Off',
		chase: self.chaseEnabled ? 'On' : 'Off',
		chase_status: self.chaseStatus,
	})
}

module.exports.formatTime = formatTime
