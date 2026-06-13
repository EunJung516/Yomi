// localStorage 읽기/쓰기를 담당하는 유틸리티 모음입니다.
// 모든 데이터(폴더, 단어, 설정, 최근 세션 오답, 일별 학습 기록)는
// 아래 키들을 통해 localStorage에 JSON 형태로 저장됩니다.

export const STORAGE_KEYS = {
  FOLDERS: 'jpvoca_folders',
  WORDS: 'jpvoca_words',
  SETTINGS: 'jpvoca_settings',
  LAST_SESSION_WRONG: 'jpvoca_last_session_wrong',
  DAILY_STATS: 'jpvoca_daily_stats',
}

export const DEFAULT_SETTINGS = {
  recentCount: 50, // "최근 추가 단어" 기준 개수 (사용자 조절 가능)
  showKanji: true, // 가나/한자 표시 토글
}

const DEFAULT_FOLDER = {
  id: 'default',
  name: '기본 단어장',
  createdAt: Date.now(),
}

function safeParse(raw, fallback) {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch (e) {
    console.error('localStorage 데이터 파싱 실패:', e)
    return fallback
  }
}

export function loadFolders() {
  const raw = localStorage.getItem(STORAGE_KEYS.FOLDERS)
  const folders = safeParse(raw, null)
  if (!folders || folders.length === 0) {
    return [DEFAULT_FOLDER]
  }
  return folders
}

export function saveFolders(folders) {
  localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders))
}

export function loadWords() {
  const raw = localStorage.getItem(STORAGE_KEYS.WORDS)
  return safeParse(raw, [])
}

export function saveWords(words) {
  localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words))
}

export function loadSettings() {
  const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS)
  return { ...DEFAULT_SETTINGS, ...safeParse(raw, {}) }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

// 폴더별 "최근 세션 오답" 단어 id 목록: { [folderId]: string[] }
export function loadLastSessionWrong() {
  const raw = localStorage.getItem(STORAGE_KEYS.LAST_SESSION_WRONG)
  return safeParse(raw, {})
}

export function saveLastSessionWrong(map) {
  localStorage.setItem(STORAGE_KEYS.LAST_SESSION_WRONG, JSON.stringify(map))
}

// 날짜별 학습(채점) 문제 수: { 'YYYY-MM-DD': number }
export function loadDailyStats() {
  const raw = localStorage.getItem(STORAGE_KEYS.DAILY_STATS)
  return safeParse(raw, {})
}

export function saveDailyStats(stats) {
  localStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(stats))
}

export function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// 모든 데이터를 JSON 파일로 내보내기 위한 객체를 구성합니다.
export function buildExportData() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    folders: loadFolders(),
    words: loadWords(),
    settings: loadSettings(),
  }
}

// 가져온 JSON 데이터를 검증하고 localStorage에 반영합니다.
export function importData(data) {
  if (!data || !Array.isArray(data.words) || !Array.isArray(data.folders)) {
    throw new Error('올바르지 않은 데이터 형식입니다.')
  }
  saveFolders(data.folders)
  saveWords(data.words)
  if (data.settings) saveSettings({ ...DEFAULT_SETTINGS, ...data.settings })
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.FOLDERS)
  localStorage.removeItem(STORAGE_KEYS.WORDS)
  localStorage.removeItem(STORAGE_KEYS.LAST_SESSION_WRONG)
  localStorage.removeItem(STORAGE_KEYS.DAILY_STATS)
  // 설정(가나/한자 토글, 최근 개수)은 유지합니다.
}
