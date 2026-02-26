/**
 * 텍스트 정규화 유틸리티
 * 공백 제거, 특수문자 제거, 소문자화 등을 통해 데이터 비교를 안전하게 만듭니다.
 */
export function normalizeText(text: string): string {
  if (!text) return "";
  // Mac NFD 문제를 해결하기 위해 NFC로 정규화 후 공백 제거 및 소문자화
  return text.normalize("NFC").trim().toLowerCase().replace(/\s+/g, "");
}

/**
 * 카테고리/브랜드 매칭 엔진
 */
export function isMatch(source: string, target: string): boolean {
  const normSource = normalizeText(source);
  const normTarget = normalizeText(target);

  if (!normTarget || normTarget === "all" || normTarget === "전체") return true;
  if (!normSource) return false; // 소스가 없으면 매칭 실패

  return normSource.includes(normTarget) || normTarget.includes(normSource);
}
