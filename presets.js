const { combineRgb } = require('@companion-module/base')

module.exports = function (self) {
	const presets = {}

	presets['go'] = {
		type: 'button',
		category: 'Transport',
		name: 'GO',
		style: {
			text: 'GO',
			size: '24',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 102, 0), // always green; brightens while playing
		},
		steps: [{ down: [{ actionId: 'go', options: {} }], up: [] }],
		feedbacks: [
			{
				feedbackId: 'isPlaying',
				options: {},
				style: { bgcolor: combineRgb(0, 204, 0), color: combineRgb(255, 255, 255) },
			},
		],
	}

	presets['stop'] = {
		type: 'button',
		category: 'Transport',
		name: 'Stop',
		style: {
			text: 'STOP',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(102, 0, 0),
		},
		steps: [{ down: [{ actionId: 'stop', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets['next'] = {
		type: 'button',
		category: 'Transport',
		name: 'Next Track',
		style: {
			text: 'NEXT',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [{ down: [{ actionId: 'next', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets['previous'] = {
		type: 'button',
		category: 'Transport',
		name: 'Previous Track',
		style: {
			text: 'PREV',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [{ down: [{ actionId: 'previous', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets['mode_toggle'] = {
		type: 'button',
		category: 'Transport',
		name: 'Mode: Show',
		style: {
			text: 'SHOW\\nMODE',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [{ down: [{ actionId: 'set_mode', options: { mode: 'show' } }], up: [] }],
		feedbacks: [{ feedbackId: 'modeIs', options: { mode: 'show' } }],
	}

	// One "Song" preset per known track (populated once SonaCue has reported
	// its track count via `/sonacue/status/trackCount`). Duplicate/re-index
	// these in Companion if you want direct-fire buttons for a specific show.
	const trackCount = self.trackCount || 8
	for (let i = 1; i <= trackCount; i++) {
		presets[`song_${i}`] = {
			type: 'button',
			category: 'Songs',
			name: `Song ${i}`,
			style: {
				text: `SONG ${i}`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [{ down: [{ actionId: 'go_track', options: { index: i } }], up: [] }],
			feedbacks: [
				{
					feedbackId: 'currentTrackIs',
					options: { index: i },
					style: { bgcolor: combineRgb(0, 102, 204), color: combineRgb(255, 255, 255) },
				},
			],
		}
	}

	self.setPresetDefinitions(presets)
}
