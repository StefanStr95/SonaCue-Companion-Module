module.exports = function (self) {
	self.setActionDefinitions({
		go: {
			name: 'GO',
			description: 'Start the selected track, or leave the current loop if already playing inside one.',
			options: [],
			callback: async () => {
				self.sendOsc('/sonacue/go')
			},
		},
		stop: {
			name: 'Stop',
			options: [],
			callback: async () => {
				self.sendOsc('/sonacue/stop')
			},
		},
		play_pause: {
			name: 'Play / Pause',
			options: [],
			callback: async () => {
				self.sendOsc('/sonacue/playPause')
			},
		},
		next: {
			name: 'Next Track',
			options: [],
			callback: async () => {
				self.sendOsc('/sonacue/next')
			},
		},
		previous: {
			name: 'Previous Track',
			options: [],
			callback: async () => {
				self.sendOsc('/sonacue/previous')
			},
		},
		select_track: {
			name: 'Select Track by Index',
			description: 'Selects the track without firing it.',
			options: [
				{
					type: 'number',
					id: 'index',
					label: 'Track # (1-based)',
					min: 1,
					max: 999,
					default: 1,
					required: true,
				},
			],
			callback: async (event) => {
				self.sendOsc('/sonacue/track/select', [{ type: 'i', value: parseInt(event.options.index, 10) }])
			},
		},
		go_track: {
			name: 'GO Track by Index',
			description: 'Selects the track at this position and fires it — like pressing GO on that cue.',
			options: [
				{
					type: 'number',
					id: 'index',
					label: 'Track # (1-based)',
					min: 1,
					max: 999,
					default: 1,
					required: true,
				},
			],
			callback: async (event) => {
				self.sendOsc('/sonacue/track/go', [{ type: 'i', value: parseInt(event.options.index, 10) }])
			},
		},
		set_mode: {
			name: 'Set Mode',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					choices: [
						{ id: 'edit', label: 'Edit' },
						{ id: 'show', label: 'Show' },
					],
					default: 'show',
				},
			],
			callback: async (event) => {
				self.sendOsc('/sonacue/mode', [{ type: 's', value: event.options.mode }])
			},
		},
	})
}
