const { combineRgb } = require('@companion-module/base')

/** What SonaCue reports as chase status, in `/sonacue/status/chase i s`. */
const CHASE_STATES = [
	{ id: 'locked', label: 'Locked' },
	{ id: 'freewheel', label: 'Freewheel' },
	{ id: 'suspended', label: 'Suspended' },
	{ id: 'no signal', label: 'No signal' },
	{ id: 'waiting', label: 'Waiting for app' },
	{ id: 'off', label: 'Off' },
]

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
		currentSectionIs: {
			type: 'boolean',
			name: 'Current Section Is',
			description: 'True while the playing cue is inside section N (1-based).',
			defaultStyle: {
				bgcolor: combineRgb(0, 128, 128),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					type: 'number',
					id: 'index',
					label: 'Section # (1-based)',
					min: 1,
					max: 999,
					default: 1,
					required: true,
				},
			],
			callback: (feedback) => self.currentSectionIndex === parseInt(feedback.options.index, 10),
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
		chaseEnabled: {
			type: 'boolean',
			name: 'Chase On',
			description: 'True while SonaCue follows incoming timecode.',
			defaultStyle: {
				bgcolor: combineRgb(0, 102, 204),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => self.chaseEnabled,
		},
		chaseStatusIs: {
			type: 'boolean',
			name: 'Chase Status Is',
			description: 'True while chase is in the chosen state (locked, freewheel, suspended…).',
			defaultStyle: {
				bgcolor: combineRgb(0, 153, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					type: 'dropdown',
					id: 'status',
					label: 'Status',
					choices: CHASE_STATES,
					default: 'locked',
				},
			],
			callback: (feedback) => self.chaseStatus === feedback.options.status,
		},
	})
}

module.exports.CHASE_STATES = CHASE_STATES
