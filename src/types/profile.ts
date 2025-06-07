import type { City, Gu } from "@/utils/area";

export type Position =
  | "GK" // 골키퍼
  | "DR" // 우측 수비수
  | "DC" // 중앙 수비수
  | "DL" // 좌측 수비수
  | "DMC" // 수비형 미드필더
  | "MC" // 중앙 미드필더
  | "AML" // 좌측 공격형 미드필더
  | "AMC" // 중앙 공격형 미드필더
  | "AMR" // 우측 공격형 미드필더
  | "ST"; // 스트라이커

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  position: Position[]; // 필수 배열, null 불허
  city?: City; // 선택적 시/도
  district?: Gu; // 선택적 구/군
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  name: string;
  phone: string;
  position: Position[];
  city?: City; // 선택적 시/도
  district?: Gu; // 선택적 구/군
  email?: string;
}

export interface ProfileValidationErrors {
  name?: string;
  phone?: string;
  position?: string;
  city?: string;
  district?: string;
  email?: string;
}

export const POSITIONS: { value: Position; label: string }[] = [
  { value: "GK", label: "골키퍼 (GK)" },
  { value: "DR", label: "우측 수비수 (DR)" },
  { value: "DC", label: "중앙 수비수 (DC)" },
  { value: "DL", label: "좌측 수비수 (DL)" },
  { value: "DMC", label: "수비형 미드필더 (DMC)" },
  { value: "MC", label: "중앙 미드필더 (MC)" },
  { value: "AML", label: "좌측 공격형 미드필더 (AML)" },
  { value: "AMC", label: "중앙 공격형 미드필더 (AMC)" },
  { value: "AMR", label: "우측 공격형 미드필더 (AMR)" },
  { value: "ST", label: "스트라이커 (ST)" },
];
