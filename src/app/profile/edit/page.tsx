"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileFormSchema = z.object({
  nickname: z.string().min(2, "닉네임은 2글자 이상이어야 합니다."),
  position: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      nickname: "",
      position: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        nickname: user.nickname,
        position: user.position || "",
      });
    } else {
      // Redirect if not logged in (simple protection)
      router.push("/login");
    }
  }, [user, form, router]);

  function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      updateProfile(data);
      alert("프로필이 수정되었습니다.");
      setIsSubmitting(false);
      router.push(`/profile/${user?.id}`);
    }, 1000);
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">프로필 수정</h1>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar} alt={user.nickname} />
              <AvatarFallback className="text-2xl">
                {user.nickname.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-0 right-0 rounded-full"
              type="button"
            >
              변경
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>닉네임</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {user.role === "player" && (
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>포지션</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="포지션 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FW">공격수 (FW)</SelectItem>
                        <SelectItem value="MF">미드필더 (MF)</SelectItem>
                        <SelectItem value="DF">수비수 (DF)</SelectItem>
                        <SelectItem value="GK">골키퍼 (GK)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "저장 중..." : "저장하기"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
