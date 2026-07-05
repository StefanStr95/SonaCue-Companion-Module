const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const osc = require('osc')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariables = require('./variables')
const UpdatePresets = require('./presets')

class SonaCueInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Mirrors SonaCue's `/sonacue/status/*` feedback — updated as OSC
		// messages arrive, read by feedbacks/variables/presets.
		this.playing = false
		this.currentTrackIndex = 0
		this.currentTrackName = ''
		this.mode = 'edit'
		this.trackCount = 0
	}

	async init(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Connecting)

		this.initOsc()
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariables()
		this.updatePresets()
	}

	async destroy() {
		if (this.oscPort) {
			this.oscPort.close()
			delete this.oscPort
		}
	}

	async configUpdated(config) {
		this.config = config
		this.initOsc()
	}

	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'SonaCue Host',
				width: 8,
				regex: Regex.IP,
				default: '127.0.0.1',
			},
			{
				type: 'number',
				id: 'port',
				label: 'Command Port (SonaCue Settings → OSC → Listen Port)',
				width: 6,
				min: 1,
				max: 65535,
				default: 53000,
			},
			{
				type: 'number',
				id: 'receivePort',
				label: 'Feedback Port (SonaCue Settings → OSC → Feedback Port)',
				width: 6,
				min: 1,
				max: 65535,
				default: 53001,
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariables() {
		UpdateVariables(this)
	}

	updatePresets() {
		UpdatePresets(this)
	}

	initOsc() {
		if (this.oscPort) {
			this.oscPort.close()
			delete this.oscPort
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (!this.config.host || !this.config.port) {
			this.updateStatus(InstanceStatus.BadConfig)
			return
		}

		this.oscPort = new osc.UDPPort({
			localAddress: '0.0.0.0',
			localPort: this.config.receivePort,
			remoteAddress: this.config.host,
			remotePort: this.config.port,
			metadata: true,
		})

		this.oscPort.on('ready', () => {
			this.updateStatus(InstanceStatus.Ok)
			this.log('info', 'OSC ready')
		})

		this.oscPort.on('error', (err) => {
			this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			this.log('error', 'OSC error: ' + err.message)
		})

		this.oscPort.on('message', (oscMsg) => {
			this.handleOscMessage(oscMsg)
		})

		this.oscPort.open()
	}

	/** Sends a command to SonaCue's OSC listener. `args` follow the `osc` package's
	 * `{ type, value }` shape (e.g. `{ type: 'i', value: 3 }`). */
	sendOsc(address, args = []) {
		if (!this.oscPort) return
		this.oscPort.send({ address, args })
	}

	/** Applies an incoming `/sonacue/status/*` feedback message to local state,
	 * then refreshes the feedbacks/variables/presets that depend on it. */
	handleOscMessage(oscMsg) {
		const args = oscMsg.args || []
		switch (oscMsg.address) {
			case '/sonacue/status/playing':
				this.playing = !!args[0]?.value
				this.checkFeedbacks('isPlaying')
				this.setVariableValues({ playing: this.playing ? 'Yes' : 'No' })
				break
			case '/sonacue/status/track':
				this.currentTrackIndex = args[0]?.value ?? 0
				this.currentTrackName = args[1]?.value ?? ''
				this.checkFeedbacks('currentTrackIs')
				this.setVariableValues({
					current_track_index: this.currentTrackIndex,
					current_track_name: this.currentTrackName,
				})
				break
			case '/sonacue/status/mode':
				this.mode = args[0]?.value ?? 'edit'
				this.checkFeedbacks('modeIs')
				this.setVariableValues({ mode: this.mode })
				break
			case '/sonacue/status/trackCount':
				this.trackCount = args[0]?.value ?? 0
				this.setVariableValues({ track_count: this.trackCount })
				this.updatePresets() // the per-track "Song" preset range depends on this
				break
			default:
				break
		}
	}
}

runEntrypoint(SonaCueInstance, [])
