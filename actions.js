module.exports = function (self) {
	const indexOption = (label) => ({
		type: 'number',
		id: 'index',
		label,
		min: 1,
		max: 999,
		default: 1,
		required: true,
	})

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
			description: 'Stop with the fade-out set in SonaCue.',
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
		panic: {
			name: 'Panic',
			description: 'Stop everything at once — no fade — and send All Notes Off.',
			options: [],
			callback: async () => {
				self.sendOsc('/sonacue/panic')
			},
		},
		select_track: {
			name: 'Select Track by Index',
			description: 'Selects the track without firing it.',
			options: [indexOption('Track # (1-based)')],
			callback: async (event) => {
				self.sendOsc('/sonacue/track/select', [{ type: 'i', value: parseInt(event.options.index, 10) }])
			},
		},
		go_track: {
			name: 'GO Track by Index',
			description: 'Selects the track at this position and fires it — like pressing GO on that cue.',
			options: [indexOption('Track # (1-based)')],
			callback: async (event) => {
				self.sendOsc('/sonacue/track/go', [{ type: 'i', value: parseInt(event.options.index, 10) }])
			},
		},
		section_next: {
			name: 'Next Section',
			description: 'Jump to the next section of the playing cue, on the next bar.',
			options: [],
			callback: async () => {
				self.sendOsc('/sonacue/section/next')
			},
		},
		section_previous: {
			name: 'Previous Section',
			description: 'A little way into a section: back to its top. At its start: the section before.',
			options: [],
			callback: async () => {
				self.sendOsc('/sonacue/section/previous')
			},
		},
		section_jump: {
			name: 'Jump to Section by Index',
			description: 'Jump to section N of the playing cue, on the next bar (or beat).',
			options: [indexOption('Section # (1-based)')],
			callback: async (event) => {
				self.sendOsc('/sonacue/section/jump', [{ type: 'i', value: parseInt(event.options.index, 10) }])
			},
		},
		chase: {
			name: 'Timecode Chase',
			description:
				'Switch following timecode on or off, or toggle it. After an Escape, Stop or Panic, "On" and "Toggle" resume following the master. A locked show only resumes.',
			options: [
				{
					type: 'dropdown',
					id: 'state',
					label: 'Chase',
					choices: [
						{ id: 'toggle', label: 'Toggle' },
						{ id: 'on', label: 'On' },
						{ id: 'off', label: 'Off' },
					],
					default: 'toggle',
				},
			],
			callback: async (event) => {
				const state = event.options.state
				if (state === 'on') self.sendOsc('/sonacue/chase', [{ type: 'i', value: 1 }])
				else if (state === 'off') self.sendOsc('/sonacue/chase', [{ type: 'i', value: 0 }])
				else self.sendOsc('/sonacue/chase')
			},
		},
		click: {
			name: 'Click',
			description:
				"Switch the selected cue's click (the metronome beside the BPM) on or off, or toggle it — heard at once. A cue without a beat grid has no click.",
			options: [
				{
					type: 'dropdown',
					id: 'state',
					label: 'Click',
					choices: [
						{ id: 'toggle', label: 'Toggle' },
						{ id: 'on', label: 'On' },
						{ id: 'off', label: 'Off' },
					],
					default: 'toggle',
				},
			],
			callback: async (event) => {
				const state = event.options.state
				if (state === 'on') self.sendOsc('/sonacue/click', [{ type: 'i', value: 1 }])
				else if (state === 'off') self.sendOsc('/sonacue/click', [{ type: 'i', value: 0 }])
				else self.sendOsc('/sonacue/click')
			},
		},
		setlist: {
			name: 'Show Setlist',
			description:
				'Show a setlist: its number (1-based, in the order of the setlist menu) or its name. Leave it empty for All Cues. GO, the track numbers and Next/Previous follow it at once.',
			options: [
				{
					type: 'textinput',
					id: 'setlist',
					label: 'Setlist number or name (empty = All Cues)',
					default: '1',
					useVariables: true,
				},
			],
			callback: async (event, context) => {
				const raw = event.options.setlist ?? ''
				const value = String(context?.parseVariablesInString ? await context.parseVariablesInString(raw) : raw).trim()
				if (value === '') self.sendOsc('/sonacue/setlist/all')
				else if (/^\d+$/.test(value)) self.sendOsc('/sonacue/setlist', [{ type: 'i', value: parseInt(value, 10) }])
				else self.sendOsc('/sonacue/setlist', [{ type: 's', value }])
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
