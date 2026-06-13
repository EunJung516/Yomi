// Web Speech API를 이용한 일본어 발음 재생 유틸리티입니다.

let cachedVoices = []

function loadVoices() {
  cachedVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []
  return cachedVoices
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices()
  window.speechSynthesis.onvoiceschanged = loadVoices
}

// 가능한 한 자연스러운 일본어 음성을 선택합니다.
function pickJapaneseVoice() {
  const voices = cachedVoices.length ? cachedVoices : loadVoices()
  const jaVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('ja'))
  if (jaVoices.length === 0) return null

  // "Google", "Natural", "Neural" 등의 이름을 가진 고품질 음성을 우선 선택합니다.
  const preferred = jaVoices.find((v) =>
    /google|natural|neural|enhanced/i.test(v.name)
  )
  return preferred || jaVoices[0]
}

export function speakJapanese(text) {
  if (!window.speechSynthesis || !text) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  utterance.rate = 0.95
  const voice = pickJapaneseVoice()
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && !!window.speechSynthesis
}
