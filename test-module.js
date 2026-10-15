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
		linkRole: 'off',
		linkStatus: 'off',
		nextTrackIndex: 0,
		nextTrackName: '',
		setlistIndex: 0,
		setlistName: 'All Cues',
		clickOn: false,
		clickAvailable: false,
		elapsed: 0,
		remaining: 0,
		looping: false,
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

	self.actions.click.callback({ options: { state: 'toggle' } })
	self.actions.click.callback({ options: { state: 'off' } })
	const click = self._sent.filter((m) => m.address === '/sonacue/click')
	assert.deepStrictEqual(
		click.map((m) => m.args),
		[undefined, [{ type: 'i', value: 0 }]],
	)
}

// The setlist action: a number, a name, or empty for All Cues — awaited, since
// it parses variables first.
const setlistTest = (async () => {
	const self = makeSelf()
	require('./actions')(self)
	const context = { parseVariablesInString: async (s) => s.replace('$(internal:x)', '2') }
	await self.actions.setlist.callback({ options: { setlist: ' 3 ' } }, context)
	await self.actions.setlist.callback({ options: { setlist: 'Encore' } }, context)
	await self.actions.setlist.callback({ options: { setlist: '' } }, context)
	await self.actions.setlist.callback({ options: { setlist: '$(internal:x)' } }, context)
	assert.deepStrictEqual(self._sent, [
		{ address: '/sonacue/setlist', args: [{ type: 'i', value: 3 }] },
		{ address: '/sonacue/setlist', args: [{ type: 's', value: 'Encore' }] },
		{ address: '/sonacue/setlist/all', args: undefined },
		{ address: '/sonacue/setlist', args: [{ type: 'i', value: 2 }] },
	])
	console.log('setlist action OK')
})()

{
	const self = makeSelf()
	require('./actions')(self)
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
	assert.strictEqual(self.feedbacks.linkMainLost.callback(), false)
	assert.strictEqual(self.feedbacks.linkFollowing.callback(), false)
	self.linkRole = 'backup'
	self.linkStatus = 'mainlost'
	assert.strictEqual(self.feedbacks.linkMainLost.callback(), true)
	assert.strictEqual(self.feedbacks.linkFollowing.callback(), false)
	self.linkStatus = 'following'
	assert.strictEqual(self.feedbacks.linkMainLost.callback(), false)
	assert.strictEqual(self.feedbacks.linkFollowing.callback(), true)
	self.linkRole = 'main'
	self.linkStatus = 'followed'
	assert.strictEqual(self.feedbacks.linkFollowing.callback(), true)
	self.linkStatus = 'mainlost'
	assert.strictEqual(self.feedbacks.linkMainLost.callback(), false, 'only a backup loses its main')
	self.linkStatus = 'waiting'
	assert.strictEqual(self.feedbacks.linkFollowing.callback(), false)
	self.currentSectionIndex = 3
	assert.strictEqual(self.feedbacks.currentSectionIs.callback({ options: { index: '3' } }), true)
	self.clickOn = true
	assert.strictEqual(self.feedbacks.clickOn.callback(), false, 'no grid, no click')
	self.clickAvailable = true
	assert.strictEqual(self.feedbacks.clickOn.callback(), true)
	assert.strictEqual(self.feedbacks.setlistIs.callback({ options: { index: 0 } }), true)
	self.playing = true
	self.remaining = 12.4
	assert.strictEqual(self.feedbacks.remainingBelow.callback({ options: { seconds: 30 } }), true)
	assert.strictEqual(self.feedbacks.remainingBelow.callback({ options: { seconds: 10 } }), false)
	self.looping = true
	assert.strictEqual(
		self.feedbacks.remainingBelow.callback({ options: { seconds: 30 } }),
		false,
		'no warning in a vamp',
	)
	self.looping = false
	self.playing = false
	assert.strictEqual(self.feedbacks.remainingBelow.callback({ options: { seconds: 30 } }), false)
	console.log('feedbacks.js OK —', Object.keys(self.feedbacks).length, 'feedbacks')
}

// variables.js
{
	const self = makeSelf()
	require('./variables')(self)
	assert(self.variableDefs.some((v) => v.variableId === 'playing'))
	assert.strictEqual(self.variableValues.playing, 'No')
	assert.strictEqual(self.variableValues.chase, 'Off')
	assert.strictEqual(self.variableValues.link_role, 'off')
	assert.strictEqual(self.variableValues.link_status, 'off')
	assert(self.variableDefs.some((v) => v.variableId === 'section_name'))
	assert.strictEqual(self.variableValues.remaining, '0:00')
	assert.strictEqual(self.variableValues.setlist_name, 'All Cues')
	assert.strictEqual(self.variableValues.click, 'No grid')
	const { formatTime } = require('./variables')
	assert.strictEqual(formatTime(75.9), '1:15')
	assert.strictEqual(formatTime(75.1, Math.ceil), '1:16')
	assert.strictEqual(formatTime(3725), '1:02:05')
	assert.strictEqual(formatTime(-3), '0:00')
	console.log('variables.js OK —', self.variableDefs.length, 'variables')
}

// presets.js
{
	const self = makeSelf()
	require('./presets')(self)
	assert(self.presets.go)
	assert(self.presets.chase_toggle && self.presets.panic && self.presets.section_8)
	assert(self.presets.song_1 && self.presets.song_3 && !self.presets.song_4, 'song presets match trackCount=3')
	for (const id of [
		'countdown',
		'elapsed',
		'next_up',
		'click_toggle',
		'setlist_all',
		'setlist_4',
		'setlist_now',
		'link_status',
	])
		assert(self.presets[id], id + ' preset')
	console.log('presets.js OK —', Object.keys(self.presets).length, 'presets')
}

setlistTest.then(
	() => console.log('\nAll module smoke tests passed.'),
	(e) => {
		console.error(e)
		process.exit(1)
	},
)
