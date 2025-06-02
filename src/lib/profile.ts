import { createClient } from "@/utils/supabase/client";
import type { UserProfile, ProfileFormData } from "@/types/profile";

const supabase = createClient();

/**
 * 프로필 완성도를 확인합니다.
 */
export const getProfileCompleteness = (
  profile: UserProfile | ProfileFormData
): {
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
} => {
  const requiredFields = ["name", "nickname", "position"];
  const optionalFields = ["phone"];
  const missingFields: string[] = [];
  let completedRequired = 0;
  let completedOptional = 0;

  // 필수 필드 확인
  requiredFields.forEach((field) => {
    const value = profile[field as keyof typeof profile];
    if (value && typeof value === "string" && value.trim()) {
      completedRequired++;
    } else {
      missingFields.push(field);
    }
  });

  // 선택 필드 확인
  optionalFields.forEach((field) => {
    const value = profile[field as keyof typeof profile];
    if (value && typeof value === "string" && value.trim()) {
      completedOptional++;
    }
  });

  const totalRequired = requiredFields.length;
  const totalOptional = optionalFields.length;
  const completionPercentage = Math.round(
    ((completedRequired + completedOptional * 0.5) /
      (totalRequired + totalOptional * 0.5)) *
      100
  );

  return {
    isComplete: completedRequired === totalRequired,
    completionPercentage,
    missingFields,
  };
};

/**
 * 사용자 프로필을 생성합니다.
 */
export const createProfile = async (
  userId: string,
  profileData: ProfileFormData
): Promise<{ profile: UserProfile | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        user_id: userId,
        ...profileData,
      })
      .select()
      .single();

    if (error) {
      return { profile: null, error: error.message };
    }

    return { profile: data, error: null };
  } catch (error) {
    return {
      profile: null,
      error:
        error instanceof Error
          ? error.message
          : "프로필 생성 중 오류가 발생했습니다.",
    };
  }
};

/**
 * 사용자 프로필을 가져옵니다.
 */
export const getProfile = async (
  userId: string
): Promise<{ profile: UserProfile | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // 프로필이 없는 경우
        return { profile: null, error: null };
      }
      return { profile: null, error: error.message };
    }

    return { profile: data, error: null };
  } catch (error) {
    return {
      profile: null,
      error:
        error instanceof Error
          ? error.message
          : "프로필 조회 중 오류가 발생했습니다.",
    };
  }
};

/**
 * 사용자 프로필을 업데이트합니다.
 */
export const updateProfile = async (
  userId: string,
  profileData: Partial<ProfileFormData>
): Promise<{ profile: UserProfile | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return { profile: null, error: error.message };
    }

    return { profile: data, error: null };
  } catch (error) {
    return {
      profile: null,
      error:
        error instanceof Error
          ? error.message
          : "프로필 업데이트 중 오류가 발생했습니다.",
    };
  }
};

/**
 * 닉네임 중복을 확인합니다.
 */
export const checkNicknameAvailability = async (
  nickname: string,
  excludeUserId?: string
): Promise<{ available: boolean; error: string | null }> => {
  try {
    let query = supabase.from("profiles").select("id").eq("nickname", nickname);

    if (excludeUserId) {
      query = query.neq("user_id", excludeUserId);
    }

    const { data, error } = await query;

    if (error) {
      return { available: false, error: error.message };
    }

    return { available: data.length === 0, error: null };
  } catch (error) {
    return {
      available: false,
      error:
        error instanceof Error
          ? error.message
          : "닉네임 확인 중 오류가 발생했습니다.",
    };
  }
};
