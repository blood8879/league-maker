export type Position =
  | "goalkeeper"
  | "defender"
  | "midfielder"
  | "forward"
  | "any";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  nickname: string;
  phone: string;
  position: Position;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  name: string;
  nickname: string;
  phone: string;
  position: Position;
  email?: string;
}

export interface ProfileValidationErrors {
  name?: string;
  nickname?: string;
  phone?: string;
  position?: string;
  email?: string;
}

export const POSITIONS: { value: Position; label: string }[] = [
  { value: "goalkeeper", label: "골키퍼 (GK)" },
  { value: "defender", label: "수비수 (DF)" },
  { value: "midfielder", label: "미드필더 (MF)" },
  { value: "forward", label: "공격수 (FW)" },
  { value: "any", label: "포지션 무관" },
];
