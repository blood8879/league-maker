"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MOCK_LEAGUES, MOCK_TEAMS } from "@/lib/mock-data";

const matchFormSchema = z.object({
  type: z.enum(["league", "cup", "friendly", "practice"]),
  leagueId: z.string().optional(),
  homeTeamId: z.string().min(1, "홈팀을 선택해주세요."),
  awayTeamId: z.string().min(1, "상대팀을 선택해주세요."),
  date: z.string().min(1, "날짜를 선택해주세요."),
  time: z.string().min(1, "시간을 선택해주세요."),
  venue: z.string().min(1, "장소를 입력해주세요."),
  mercenaryEnabled: z.boolean(),
  mercenaryCount: z.string().optional(),
  mercenaryPositions: z.array(z.string()).optional(),
});

type MatchFormValues = z.infer<typeof matchFormSchema>;

export function MatchCreationForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      type: "friendly",
      mercenaryEnabled: false,
      mercenaryPositions: [],
    },
  });

  const watchType = form.watch("type");
  const watchMercenaryEnabled = form.watch("mercenaryEnabled");

  function onSubmit(data: MatchFormValues) {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log(data);
      alert("경기가 생성되었습니다.");
      setIsSubmitting(false);
      router.push("/matches/m102"); // Redirect to mock match detail
    }, 1000);
  }

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-center">
          {step === 1 && "경기 유형 선택"}
          {step === 2 && "경기 상세 정보"}
          {step === 3 && "참석 및 용병 설정"}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && (
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>어떤 경기를 생성하시나요?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="league" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              🏆 리그/컵 경기 (공식 경기)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="friendly" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              ⚽ 친선 경기
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="practice" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              🏃 연습 경기
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="button" onClick={nextStep} className="w-full">다음</Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                {watchType === "league" ? (
                  <FormField
                    control={form.control}
                    name="leagueId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>리그 선택</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="리그를 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MOCK_LEAGUES.map((league) => (
                              <SelectItem key={league.id} value={league.id}>
                                {league.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="homeTeamId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>내 팀</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="팀을 선택하세요" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MOCK_TEAMS.map((team) => (
                                <SelectItem key={team.id} value={team.id}>
                                  {team.name}
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
                      name="awayTeamId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>상대 팀</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="상대 팀을 선택하세요" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MOCK_TEAMS.map((team) => (
                                <SelectItem key={team.id} value={team.id}>
                                  {team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>날짜</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>시간</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>장소</FormLabel>
                      <FormControl>
                        <Input placeholder="경기장 이름 또는 주소" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>이전</Button>
                <Button type="button" onClick={nextStep}>다음</Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardContent className="pt-6 space-y-6">
                {watchType !== "league" && (
                  <FormField
                    control={form.control}
                    name="mercenaryEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            용병 모집
                          </FormLabel>
                          <FormDescription>
                            부족한 인원을 채우기 위해 용병을 모집합니다.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {watchMercenaryEnabled && (
                  <div className="space-y-4 pl-6 border-l-2 border-muted ml-2">
                    <FormField
                      control={form.control}
                      name="mercenaryCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>모집 인원</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="예: 2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mercenaryPositions"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">모집 포지션</FormLabel>
                            <FormDescription>
                              필요한 포지션을 모두 선택해주세요.
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {["FW", "MF", "DF", "GK"].map((item) => (
                              <FormField
                                key={item}
                                control={form.control}
                                name="mercenaryPositions"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), item])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {item}
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
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>이전</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "생성 중..." : "경기 생성 완료"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </form>
      </Form>
    </div>
  );
}
