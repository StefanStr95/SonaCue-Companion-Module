const { combineRgb } = require('@companion-module/base')

module.exports = function (self) {
	self.setFeedbackDefinitions({
		isPlaying: {
			type: 'boolean',
			name: 'Playing',
			description: 'True while SonaCue is playing back a track.',
			defaultStyle: {
				bgcolor: combineRgb(0, 153, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => self.playing,
		},
		currentTrackIs: {
			type: 'boolean',
			name: 'Current Track Is',
			description: 'True while the given 1-based track index is selected/playing.',
			defaultStyle: {
				bgcolor: combineRgb(0, 102, 204),
				color: combineRgb(255, 255, 255),
			},
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
			callback: (feedback) => self.currentTrackIndex === parseInt(feedback.options.index, 10),
		},
		modeIs: {
			type: 'boolean',
			name: 'Mode Is',
			defaultStyle: {
				bgcolor: combineRgb(204, 102, 0),
				color: combineRgb(255, 255, 255),
			},
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
			callback: (feedback) => self.mode === feedback.options.mode,
		},
	})
}
