// Smoke test exercising actions/feedbacks/variables/presets against a mock
// `self`, without needing Companion's full IPC runtime (`node test-module.js`).
const assert = require('assert')

function makeSelf() {
	const sent = []
	return {
		playing: false,
		currentTrackIndex: 0,
		currentTrackName: '',
		mode: 'edit',
		trackCount: 3,
		currentSectionIndex: 0,
		currentSectionName: '',
		chaseEnabled: false,
		chaseStatus: 'off',
		sendOsc(address, args) {
			sent.push({ address, args })
		},
		_sent: sent,
		setActionDefinitions(defs) {
			this.actions = defs
		},
		setFeedbackDefinitions(defs) {
			this.feedbacks = defs
		},
		setVariableDefinitions(defs) {
			this.variableDefs = defs
		},
		setVariableValues(vals) {
			this.variableValues = { ...(this.variableValues || {}), ...vals }
		},
		setPresetDefinitions(defs) {
			this.presets = defs
		},
	}
}

// actions.js
{
	const self = makeSelf()
	require('./actions')(self)
	assert(self.actions.go, 'go action defined')
	self.actions.go.callback({ options: {} })
	assert.strictEqual(self._sent[0].address, '/sonacue/go')

	self.actions.go_track.callback({ options: { index: '3' } })
	const goTrack = self._sent.find((m) => m.address === '/sonacue/track/go')
	assert.deepStrictEqual(goTrack.args, [{ type: 'i', value: 3 }])

	self.actions.set_mode.callback({ options: { mode: 'show' } })
	const mode = self._sent.find((m) => m.address === '/sonacue/mode')
	assert.deepStrictEqual(mode.args, [{ type: 's', value: 'show' }])
	self.actions.chase.callback({ options: { state: 'toggle' } })
	self.actions.chase.callback({ options: { state: 'on' } })
	self.actions.chase.callback({ options: { state: 'off' } })
	const chase = self._sent.filter((m) => m.address === '/sonacue/chase')
	assert.deepStrictEqual(
		chase.map((m) => m.args),
		[undefined, [{ type: 'i', value: 1 }], [{ type: 'i', value: 0 }]],
	)

	self.actions.section_jump.callback({ options: { index: '2' } })
	const jump = self._sent.find((m) => m.address === '/sonacue/section/jump')
	assert.deepStrictEqual(jump.args, [{ type: 'i', value: 2 }])
	for (const id of ['panic', 'section_next', 'section_previous']) assert(self.actions[id], id + ' defined')
	console.log('actions.js OK —', Object.keys(self.actions).length, 'actions')
}

// feedbacks.js
{
	const self = makeSelf()
	require('./feedbacks')(self)
	assert(self.feedbacks.isPlaying)
	assert.strictEqual(self.feedbacks.isPlaying.callback(), false)
	self.playing = true
	assert.strictEqual(self.feedbacks.isPlaying.callback(), true)

	self.currentTrackIndex = 5
	assert.strictEqual(self.feedbacks.currentTrackIs.callback({ options: { index: 5 } }), true)
	assert.strictEqual(self.feedbacks.currentTrackIs.callback({ options: { index: 6 } }), false)

	self.mode = 'show'
	assert.strictEqual(self.feedbacks.modeIs.callback({ options: { mode: 'show' } }), true)
	assert.strictEqual(self.feedbacks.modeIs.callback({ options: { mode: 'edit' } }), false)
	self.chaseEnabled = true
	self.chaseStatus = 'locked'
	assert.strictEqual(self.feedbacks.chaseEnabled.callback(), true)
	assert.strictEqual(self.feedbacks.chaseStatusIs.callback({ options: { status: 'locked' } }), true)
	assert.strictEqual(self.feedbacks.chaseStatusIs.callback({ options: { status: 'suspended' } }), false)
	self.currentSectionIndex = 3
	assert.strictEqual(self.feedbacks.currentSectionIs.callback({ options: { index: '3' } }), true)
	console.log('feedbacks.js OK —', Object.keys(self.feedbacks).length, 'feedbacks')
}

// variables.js
{
	const self = makeSelf()
	require('./variables')(self)
	assert(self.variableDefs.some((v) => v.variableId === 'playing'))
	assert.strictEqual(self.variableValues.playing, 'No')
	assert.strictEqual(self.variableValues.chase, 'Off')
	assert(self.variableDefs.some((v) => v.variableId === 'section_name'))
	console.log('variables.js OK —', self.variableDefs.length, 'variables')
}

// presets.js
{
	const self = makeSelf()
	require('./presets')(self)
	assert(self.presets.go)
	assert(self.presets.chase_toggle && self.presets.panic && self.presets.section_8)
	assert(self.presets.song_1 && self.presets.song_3 && !self.presets.song_4, 'song presets match trackCount=3')
	console.log('presets.js OK —', Object.keys(self.presets).length, 'presets')
}

console.log('\nAll module smoke tests passed.')
