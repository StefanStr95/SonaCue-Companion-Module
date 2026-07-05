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
	console.log('feedbacks.js OK —', Object.keys(self.feedbacks).length, 'feedbacks')
}

// variables.js
{
	const self = makeSelf()
	require('./variables')(self)
	assert(self.variableDefs.some((v) => v.variableId === 'playing'))
	assert.strictEqual(self.variableValues.playing, 'No')
	console.log('variables.js OK —', self.variableDefs.length, 'variables')
}

// presets.js
{
	const self = makeSelf()
	require('./presets')(self)
	assert(self.presets.go)
	assert(self.presets.song_1 && self.presets.song_3 && !self.presets.song_4, 'song presets match trackCount=3')
	console.log('presets.js OK —', Object.keys(self.presets).length, 'presets')
}

console.log('\nAll module smoke tests passed.')
