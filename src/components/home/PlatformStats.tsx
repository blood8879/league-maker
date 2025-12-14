import { Shield, Trophy, Users, Goal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function PlatformStats() {
  const stats = [
    {
      label: "등록된 팀 수",
      value: "1,234",
      suffix: "개 팀",
      icon: Shield,
      color: "text-primary",
    },
    {
      label: "총 경기 수",
      value: "5,678",
      suffix: "경기",
      icon: Trophy, // Using Trophy as Ball icon alternative or I can use Circle
      color: "text-secondary",
    },
    {
      label: "활동 중인 플레이어",
      value: "12,345",
      suffix: "명",
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "이번 주 득점",
      value: "891",
      suffix: "골",
      icon: Goal,
      color: "text-accent",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className={`mb-4 p-3 rounded-full bg-white shadow-sm ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
