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
		clickOn: {
			type: 'boolean',
			name: 'Click On',
			description: "True while the selected cue's click (the metronome beside the BPM) is on.",
			defaultStyle: {
				bgcolor: combineRgb(153, 102, 51),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => self.clickOn && self.clickAvailable,
		},
		setlistIs: {
			type: 'boolean',
			name: 'Setlist Is',
			description: "True while setlist N (1-based, in the order of SonaCue's setlist menu) is showing; 0 = All Cues.",
			defaultStyle: {
				bgcolor: combineRgb(0, 102, 204),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					type: 'number',
					id: 'index',
					label: 'Setlist # (1-based, 0 = All Cues)',
					min: 0,
					max: 99,
					default: 1,
					required: true,
				},
			],
			callback: (feedback) => self.setlistIndex === parseInt(feedback.options.index, 10),
		},
		remainingBelow: {
			type: 'boolean',
			name: 'Remaining Time Below',
			description:
				'True while a cue plays with no more than the given seconds left — a warning before the end. Off while the cue loops (a vamp, a looping cue): its end is not coming yet.',
			defaultStyle: {
				bgcolor: combineRgb(153, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					type: 'number',
					id: 'seconds',
					label: 'Seconds',
					min: 1,
					max: 3600,
					default: 30,
					required: true,
				},
			],
			callback: (feedback) =>
				self.playing && !self.looping && self.remaining > 0 && self.remaining <= parseInt(feedback.options.seconds, 10),
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
		playlistLoaded: {
			type: 'boolean',
			name: 'Playlist Cue Loaded',
			description: 'True while a playlist cue (pre-show or intermission music) is loaded in SonaCue.',
			defaultStyle: {
				bgcolor: combineRgb(204, 102, 85),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => self.titleCount > 0,
		},
		linkMainLost: {
			type: 'boolean',
			name: 'Link: Main Lost',
			description: 'True while this SonaCue is a backup that has lost the main Mac it was following.',
			defaultStyle: {
				bgcolor: combineRgb(204, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => self.linkRole === 'backup' && self.linkStatus === 'mainlost',
		},
		linkFollowing: {
			type: 'boolean',
			name: 'Link: Following',
			description: 'True while the link is up: a backup follows its main, or a main is followed by a backup.',
			defaultStyle: {
				bgcolor: combineRgb(0, 128, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () =>
				(self.linkRole === 'backup' && self.linkStatus === 'following') ||
				(self.linkRole === 'main' && self.linkStatus === 'followed'),
		},
	})
}

module.exports.CHASE_STATES = CHASE_STATES
