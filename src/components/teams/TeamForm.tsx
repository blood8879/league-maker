"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTeam } from "@/lib/supabase/queries/teams";

const teamFormSchema = z.object({
  name: z.string().min(2, "팀 이름은 2글자 이상이어야 합니다."),
  region: z.string().min(1, "지역을 선택해주세요."),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  description: z.string().min(10, "팀 소개는 10글자 이상이어야 합니다."),
  activityDays: z.array(z.string()).min(1, "활동 요일을 최소 하나 이상 선택해주세요."),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const REGIONS = [
  "서울 강남구", "서울 서초구", "서울 송파구", "서울 마포구", "서울 영등포구",
  "서울 관악구", "서울 동작구", "서울 용산구", "서울 성동구", "서울 광진구",
  "서울 동대문구", "서울 중랑구", "서울 성북구", "서울 강북구", "서울 도봉구"
];

export function TeamForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      region: "",
      description: "",
      activityDays: [],
    },
  });

  async function onSubmit(data: TeamFormValues) {
    try {
      setIsSubmitting(true);

      await createTeam({
        name: data.name,
        region: data.region,
        level: data.level,
        description: data.description,
        activity_days: data.activityDays as unknown as never,
        is_recruiting: true,
      });

      alert("팀이 성공적으로 생성되었습니다!");
      router.push("/teams");
    } catch (error) {
      console.error('Failed to create team:', error);
      alert("팀 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>팀 이름</FormLabel>
              <FormControl>
                <Input placeholder="FC 리그메이커" {...field} />
              </FormControl>
              <FormDescription>
                팀의 고유한 이름을 입력해주세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>활동 지역</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>팀 실력</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="실력 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">초급 (즐겜 위주)</SelectItem>
                    <SelectItem value="intermediate">중급 (기본기 보유)</SelectItem>
                    <SelectItem value="advanced">상급 (대회 입상 목표)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="activityDays"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">주 활동 요일</FormLabel>
                <FormDescription>
                  주로 활동하는 요일을 선택해주세요. (중복 선택 가능)
                </FormDescription>
              </div>
              <div className="flex flex-wrap gap-4">
                {DAYS.map((day) => (
                  <FormField
                    key={day}
                    control={form.control}
                    name="activityDays"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={day}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(day)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, day])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== day
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {day}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>팀 소개</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="팀의 성향, 목표, 가입 조건 등을 자유롭게 적어주세요."
                  className="resize-none h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "생성 중..." : "팀 생성하기"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
