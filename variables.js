module.exports = function (self) {
	self.setVariableDefinitions([
		{ variableId: 'playing', name: 'Playing (Yes/No)' },
		{ variableId: 'current_track_name', name: 'Current Track Name' },
		{ variableId: 'current_track_index', name: 'Current Track Index (1-based)' },
		{ variableId: 'mode', name: 'Mode (edit/show)' },
		{ variableId: 'track_count', name: 'Track Count' },
	])

	self.setVariableValues({
		playing: self.playing ? 'Yes' : 'No',
		current_track_name: self.currentTrackName,
		current_track_index: self.currentTrackIndex,
		mode: self.mode,
		track_count: self.trackCount,
	})
}
