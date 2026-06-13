// 한국어 -> 일본어 자동완성을 위한 작은 로컬 사전입니다.
// 사용자가 한국어 뜻을 입력하면 일치하는 항목을 찾아 일본어/한자를 자동으로 채워줍니다.
// 필요에 따라 자유롭게 항목을 추가하세요.

export const LOCAL_DICTIONARY = [
  { korean: '안녕하세요', japanese: 'こんにちは', kanji: '' },
  { korean: '감사합니다', japanese: 'ありがとうございます', kanji: '' },
  { korean: '물', japanese: 'みず', kanji: '水' },
  { korean: '불', japanese: 'ひ', kanji: '火' },
  { korean: '나무', japanese: 'き', kanji: '木' },
  { korean: '산', japanese: 'やま', kanji: '山' },
  { korean: '강', japanese: 'かわ', kanji: '川' },
  { korean: '바다', japanese: 'うみ', kanji: '海' },
  { korean: '하늘', japanese: 'そら', kanji: '空' },
  { korean: '땅', japanese: 'つち', kanji: '土' },
  { korean: '학교', japanese: 'がっこう', kanji: '学校' },
  { korean: '선생님', japanese: 'せんせい', kanji: '先生' },
  { korean: '학생', japanese: 'がくせい', kanji: '学生' },
  { korean: '친구', japanese: 'ともだち', kanji: '友達' },
  { korean: '가족', japanese: 'かぞく', kanji: '家族' },
  { korean: '아버지', japanese: 'ちち', kanji: '父' },
  { korean: '어머니', japanese: 'はは', kanji: '母' },
  { korean: '형', japanese: 'あに', kanji: '兄' },
  { korean: '누나', japanese: 'あね', kanji: '姉' },
  { korean: '동생', japanese: 'おとうと', kanji: '弟' },
  { korean: '음식', japanese: 'たべもの', kanji: '食べ物' },
  { korean: '밥', japanese: 'ごはん', kanji: 'ご飯' },
  { korean: '물건', japanese: 'もの', kanji: '物' },
  { korean: '시간', japanese: 'じかん', kanji: '時間' },
  { korean: '오늘', japanese: 'きょう', kanji: '今日' },
  { korean: '내일', japanese: 'あした', kanji: '明日' },
  { korean: '어제', japanese: 'きのう', kanji: '昨日' },
  { korean: '아침', japanese: 'あさ', kanji: '朝' },
  { korean: '낮', japanese: 'ひる', kanji: '昼' },
  { korean: '밤', japanese: 'よる', kanji: '夜' },
  { korean: '사람', japanese: 'ひと', kanji: '人' },
  { korean: '일', japanese: 'しごと', kanji: '仕事' },
  { korean: '회사', japanese: 'かいしゃ', kanji: '会社' },
  { korean: '집', japanese: 'いえ', kanji: '家' },
  { korean: '방', japanese: 'へや', kanji: '部屋' },
  { korean: '책', japanese: 'ほん', kanji: '本' },
  { korean: '돈', japanese: 'おかね', kanji: 'お金' },
  { korean: '차', japanese: 'くるま', kanji: '車' },
  { korean: '전철', japanese: 'でんしゃ', kanji: '電車' },
  { korean: '학교생활', japanese: 'がっこうせいかつ', kanji: '学校生活' },
  { korean: '날씨', japanese: 'てんき', kanji: '天気' },
  { korean: '비', japanese: 'あめ', kanji: '雨' },
  { korean: '눈', japanese: 'ゆき', kanji: '雪' },
  { korean: '바람', japanese: 'かぜ', kanji: '風' },
  { korean: '꽃', japanese: 'はな', kanji: '花' },
  { korean: '동물', japanese: 'どうぶつ', kanji: '動物' },
  { korean: '개', japanese: 'いぬ', kanji: '犬' },
  { korean: '고양이', japanese: 'ねこ', kanji: '猫' },
  { korean: '먹다', japanese: 'たべる', kanji: '食べる' },
  { korean: '마시다', japanese: 'のむ', kanji: '飲む' },
  { korean: '가다', japanese: 'いく', kanji: '行く' },
  { korean: '오다', japanese: 'くる', kanji: '来る' },
  { korean: '보다', japanese: 'みる', kanji: '見る' },
  { korean: '듣다', japanese: 'きく', kanji: '聞く' },
  { korean: '말하다', japanese: 'はなす', kanji: '話す' },
  { korean: '읽다', japanese: 'よむ', kanji: '読む' },
  { korean: '쓰다', japanese: 'かく', kanji: '書く' },
  { korean: '사다', japanese: 'かう', kanji: '買う' },
  { korean: '좋아하다', japanese: 'すき', kanji: '好き' },
  { korean: '싫어하다', japanese: 'きらい', kanji: '嫌い' },
  { korean: '예쁘다', japanese: 'きれい', kanji: '' },
  { korean: '크다', japanese: 'おおきい', kanji: '大きい' },
  { korean: '작다', japanese: 'ちいさい', kanji: '小さい' },
  { korean: '높다', japanese: 'たかい', kanji: '高い' },
  { korean: '낮다', japanese: 'ひくい', kanji: '低い' },
  { korean: '많다', japanese: 'おおい', kanji: '多い' },
  { korean: '적다', japanese: 'すくない', kanji: '少ない' },
  { korean: '빠르다', japanese: 'はやい', kanji: '早い' },
  { korean: '느리다', japanese: 'おそい', kanji: '遅い' },
  { korean: '맛있다', japanese: 'おいしい', kanji: '' },
  { korean: '재미있다', japanese: 'おもしろい', kanji: '面白い' },
  { korean: '하나', japanese: 'いち', kanji: '一' },
  { korean: '둘', japanese: 'に', kanji: '二' },
  { korean: '셋', japanese: 'さん', kanji: '三' },
]

// // 한국어 입력값과 가장 잘 맞는 사전 항목을 찾아 반환합니다 (정확히 일치하는 항목 우선).
// export function lookupByKorean(korean) {
//   const trimmed = korean.trim()
//   if (!trimmed) return null
//   const exact = LOCAL_DICTIONARY.find((item) => item.korean === trimmed)
//   if (exact) return exact
//   const partial = LOCAL_DICTIONARY.find(
//     (item) => item.korean.includes(trimmed) || trimmed.includes(item.korean)
//   )
//   return partial || null
// }

export function lookupByKorean(korean) {
  const trimmed = korean.trim()
  if (!trimmed) return null

  return (
    LOCAL_DICTIONARY.find((item) => item.korean === trimmed) || null
  )
}