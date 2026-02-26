import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 프로젝트 전반에서 사용되는 스타일 결합 유틸리티 (Tailwind CSS)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 텍스트 정규화 유틸리티
 * Mac NFD 문제를 해결하기 위해 NFC로 정규화 후 공백 제거 및 소문자화
 */
export function normalizeText(text: string): string {
  if (!text) return "";
  return text.normalize("NFC").trim().toLowerCase().replace(/\s+/g, "");
}

/**
 * 카테고리/브랜드 매칭 엔진
 */
export function isMatch(source: string, target: string): boolean {
  const normSource = normalizeText(source);
  const normTarget = normalizeText(target);

  if (!normTarget || normTarget === "all" || normTarget === "전체") return true;
  if (!normSource) return false;

  return normSource.includes(normTarget) || normTarget.includes(normSource);
}
