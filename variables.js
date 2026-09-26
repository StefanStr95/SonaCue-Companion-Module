module.exports = function (self) {
	self.setVariableDefinitions([
		{ variableId: 'playing', name: 'Playing (Yes/No)' },
		{ variableId: 'current_track_name', name: 'Current Track Name' },
		{ variableId: 'current_track_index', name: 'Current Track Index (1-based)' },
		{ variableId: 'mode', name: 'Mode (edit/show)' },
		{ variableId: 'track_count', name: 'Track Count' },
		{ variableId: 'section_name', name: 'Current Section Name' },
		{ variableId: 'section_index', name: 'Current Section Index (1-based, 0 = none)' },
		{ variableId: 'chase', name: 'Chase (On/Off)' },
		{ variableId: 'chase_status', name: 'Chase Status (locked, freewheel, suspended, no signal, waiting, off)' },
	])

	self.setVariableValues({
		playing: self.playing ? 'Yes' : 'No',
		current_track_name: self.currentTrackName,
		current_track_index: self.currentTrackIndex,
		mode: self.mode,
		track_count: self.trackCount,
		section_name: self.currentSectionName,
		section_index: self.currentSectionIndex,
		chase: self.chaseEnabled ? 'On' : 'Off',
		chase_status: self.chaseStatus,
	})
}
