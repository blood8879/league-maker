export type Position = "GK" | "DF" | "MF" | "FW";

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  nickname: string;
  phone?: string;
  position: Position;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  name: string;
  nickname: string;
  phone?: string;
  position: Position;
}

export interface ProfileValidationErrors {
  name?: string;
  nickname?: string;
  phone?: string;
  position?: string;
}

export const POSITIONS: { value: Position; label: string }[] = [
  { value: "GK", label: "골키퍼 (GK)" },
  { value: "DF", label: "수비수 (DF)" },
  { value: "MF", label: "미드필더 (MF)" },
  { value: "FW", label: "공격수 (FW)" },
];
