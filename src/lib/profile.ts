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
  const requiredFields = ["name", "position", "phone"];
  const missingFields: string[] = [];
  let completedRequired = 0;

  // 필수 필드 확인
  requiredFields.forEach((field) => {
    const value = profile[field as keyof typeof profile];

    // 포지션은 배열이므로 별도 처리
    if (field === "position") {
      if (Array.isArray(value) && value.length > 0) {
        completedRequired++;
      } else {
        missingFields.push(field);
      }
    } else if (value && typeof value === "string" && value.trim()) {
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
