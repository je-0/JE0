export function createInsightAudio() {
  let context = null
  let gain = null
  let nodes = []
  let playing = false

  const ensure = () => {
    if (context) return
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    context = new AudioContextClass()
    gain = context.createGain()
    gain.gain.value = 0
    gain.connect(context.destination)

    const tones = [82.4, 123.5, 164.8]
    nodes = tones.map((frequency, index) => {
      const osc = context.createOscillator()
      const filter = context.createBiquadFilter()
      osc.type = index === 0 ? 'sine' : 'triangle'
      osc.frequency.value = frequency
      filter.type = 'lowpass'
      filter.frequency.value = 420
      osc.connect(filter)
      filter.connect(gain)
      osc.start()
      return osc
    })
  }

  const play = async () => {
    ensure()
    if (context.state === 'suspended') await context.resume()
    gain.gain.cancelScheduledValues(context.currentTime)
    gain.gain.linearRampToValueAtTime(0.035, context.currentTime + 0.8)
    playing = true
  }

  const pause = () => {
    if (!context || !gain) return
    gain.gain.cancelScheduledValues(context.currentTime)
    gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.4)
    playing = false
  }

  const toggle = async () => {
    if (playing) pause()
    else await play()
    return playing
  }

  const dispose = () => {
    pause()
    nodes.forEach((node) => {
      try {
        node.stop()
        node.disconnect()
      } catch {
        /* already stopped */
      }
    })
    nodes = []
    context?.close()
    context = null
    gain = null
    playing = false
  }

  return { play, pause, toggle, dispose, isPlaying: () => playing }
}
