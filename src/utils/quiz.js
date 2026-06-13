// 퀴즈 모드, 필터 정의 및 출제/채점 관련 헬퍼 함수입니다.

export const STUDY_MODES = [
  {
    id: 'audio-to-korean',
    label: '일본어 발음을 듣고 한국어 맞추기',
    questionField: 'audio',
    answerField: 'korean',
    requiresKanji: false,
    isAudio: true,
  },
  {
    id: 'kanji-to-japanese',
    label: '한자를 보고 일본어 맞추기',
    questionField: 'kanji',
    answerField: 'japanese',
    requiresKanji: true,
  },
  {
    id: 'kanji-to-korean',
    label: '한자를 보고 한국어 맞추기',
    questionField: 'kanji',
    answerField: 'korean',
    requiresKanji: true,
  },
  {
    id: 'japanese-to-korean',
    label: '일본어를 보고 한국어 맞추기',
    questionField: 'japanese',
    answerField: 'korean',
    requiresKanji: false,
  },
  {
    id: 'korean-to-japanese',
    label: '한국어를 보고 일본어 맞추기',
    questionField: 'korean',
    answerField: 'japanese',
    requiresKanji: false,
  },
]

export const FILTERS = [
  { id: 'all', label: '전체 랜덤' },
  { id: 'wrong-focus', label: '오답 위주' },
  { id: 'favorite', label: '즐겨찾기만' },
  { id: 'recent', label: '최근 추가 단어만' },
  { id: 'last-session-wrong', label: '최근 세션 오답' },
]

// 모드에 맞춰 단어 목록을 필터링합니다 (한자 모드는 한자가 있는 단어만 대상).
export function filterWordsByModeRequirement(words, mode) {
  if (mode.requiresKanji) {
    return words.filter((w) => w.kanji && w.kanji.trim() !== '')
  }
  return words
}

// 선택한 필터에 맞춰 학습 대상 단어 목록을 구성합니다.
export function getEligibleWords({ words, folderId, filter, settings, lastSessionWrong }) {
  const folderWords = words.filter((w) => w.folderId === folderId)

  switch (filter) {
    case 'wrong-focus':
      return folderWords
        .filter((w) => w.stats.wrongCount > 0)
        .sort((a, b) => b.stats.difficultyScore - a.stats.difficultyScore)
    case 'favorite':
      return folderWords.filter((w) => w.favorite)
    case 'recent': {
      const sorted = [...folderWords].sort((a, b) => b.createdAt - a.createdAt)
      return sorted.slice(0, settings.recentCount)
    }
    case 'last-session-wrong': {
      const wrongIds = new Set(lastSessionWrong?.[folderId] || [])
      return folderWords.filter((w) => wrongIds.has(w.id))
    }
    case 'all':
    default:
      return folderWords
  }
}

// 배열을 무작위로 섞은 새 배열을 반환합니다 (Fisher-Yates).
export function shuffleArray(arr) {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// 정답 비교: 앞뒤 공백 제거, 내부 공백 제거, 대소문자 무시 후 비교합니다.
export function normalizeAnswer(text) {
  return (text || '').trim().toLowerCase().replace(/\s+/g, '')
}

export function isAnswerCorrect(userAnswer, correctAnswer) {
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer)
}

// 정답/오답 결과를 반영하여 단어의 학습 통계를 갱신한 새 객체를 반환합니다.
export function updateWordStats(word, judgement) {
  const stats = { ...word.stats }
  if (judgement === 'correct') {
    stats.correctCount += 1
    stats.difficultyScore = Math.max(0, stats.difficultyScore - 1)
  } else if (judgement === 'wrong') {
    stats.wrongCount += 1
    stats.difficultyScore += 2
  }
  // 애매함(ambiguous)은 누적 횟수에 반영하지 않고 마지막 학습일만 갱신합니다.
  stats.lastStudiedAt = Date.now()
  return { ...word, stats }
}

export function difficultyLabel(score) {
  if (score >= 4) return { text: '높음', tone: 'high' }
  if (score >= 1) return { text: '보통', tone: 'mid' }
  return { text: '낮음', tone: 'low' }
}
