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
  const requiredFields = ["name", "nickname", "position", "phone"];
  const missingFields: string[] = [];
  let completedRequired = 0;

  // 필수 필드 확인
  requiredFields.forEach((field) => {
    const value = profile[field as keyof typeof profile];
    if (value && typeof value === "string" && value.trim()) {
      completedRequired++;
    } else {
      missingFields.push(field);
    }
  });

  const totalRequired = requiredFields.length;
  const completionPercentage = Math.round(
    (completedRequired / totalRequired) * 100
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
      .from("users")
      .insert({
        id: userId,
        email: profileData.email || "",
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
      .from("users")
      .select("*")
      .eq("id", userId)
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
      .from("users")
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
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
    console.log(
      "🔍 닉네임 중복 검사 시작:",
      nickname,
      "excludeUserId:",
      excludeUserId
    );

    // PostgreSQL 함수를 사용하여 안전하게 닉네임 중복 검사
    const { data, error } = await supabase.rpc("check_nickname_availability", {
      nickname_to_check: nickname,
      exclude_user_id: excludeUserId || null,
    });

    console.log("📊 함수 호출 결과:", { data, error });

    if (error) {
      console.error("❌ 함수 호출 에러:", error);
      return { available: false, error: error.message };
    }

    const available = data === true;
    console.log("✅ 닉네임 사용 가능 여부:", available);

    return { available, error: null };
  } catch (error) {
    console.error("💥 닉네임 검사 중 예외 발생:", error);
    return {
      available: false,
      error:
        error instanceof Error
          ? error.message
          : "닉네임 확인 중 오류가 발생했습니다.",
    };
  }
};
