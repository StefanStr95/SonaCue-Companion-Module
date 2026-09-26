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

	presets['panic'] = {
		type: 'button',
		category: 'Transport',
		name: 'Panic',
		style: {
			text: 'PANIC',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(153, 0, 0),
		},
		steps: [{ down: [{ actionId: 'panic', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets['now_playing'] = {
		type: 'button',
		category: 'Status',
		name: 'Now: cue and section',
		style: {
			text: '$(sonacue:current_track_name)\\n$(sonacue:section_name)',
			size: '7',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [{ down: [], up: [] }],
		feedbacks: [
			{
				feedbackId: 'isPlaying',
				options: {},
				style: { bgcolor: combineRgb(0, 102, 0) },
			},
		],
	}

	// Chase: dim when off, blue on, green locked, yellow freewheel, red
	// suspended (after Escape/Stop/Panic — pressing it again resumes).
	presets['chase_toggle'] = {
		type: 'button',
		category: 'Timecode',
		name: 'Chase On / Off',
		style: {
			text: 'CHASE\\n$(sonacue:chase_status)',
			size: '14',
			color: combineRgb(160, 160, 160),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [{ down: [{ actionId: 'chase', options: { state: 'toggle' } }], up: [] }],
		feedbacks: [
			{
				feedbackId: 'chaseEnabled',
				options: {},
				style: { bgcolor: combineRgb(0, 51, 102), color: combineRgb(255, 255, 255) },
			},
			{ feedbackId: 'chaseStatusIs', options: { status: 'locked' }, style: { bgcolor: combineRgb(0, 128, 0) } },
			{ feedbackId: 'chaseStatusIs', options: { status: 'freewheel' }, style: { bgcolor: combineRgb(170, 130, 0) } },
			{ feedbackId: 'chaseStatusIs', options: { status: 'suspended' }, style: { bgcolor: combineRgb(153, 0, 0) } },
		],
	}

	presets['section_previous'] = {
		type: 'button',
		category: 'Sections',
		name: 'Previous Section',
		style: {
			text: '◀ SECTION',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 51, 51),
		},
		steps: [{ down: [{ actionId: 'section_previous', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets['section_next'] = {
		type: 'button',
		category: 'Sections',
		name: 'Next Section',
		style: {
			text: 'SECTION ▶',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 51, 51),
		},
		steps: [{ down: [{ actionId: 'section_next', options: {} }], up: [] }],
		feedbacks: [],
	}

	// Section N of whatever cue is playing — lit while the song is in it.
	for (let i = 1; i <= 8; i++) {
		presets[`section_${i}`] = {
			type: 'button',
			category: 'Sections',
			name: `Section ${i}`,
			style: {
				text: `SECTION ${i}`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [{ down: [{ actionId: 'section_jump', options: { index: i } }], up: [] }],
			feedbacks: [
				{
					feedbackId: 'currentSectionIs',
					options: { index: i },
					style: { bgcolor: combineRgb(0, 128, 128), color: combineRgb(255, 255, 255) },
				},
			],
		}
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
