import { BarChart3, Trophy, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function KeyFeatures() {
  const features = [
    {
      icon: BarChart3,
      title: "모든 경기를 한곳에",
      description: "득점, 어시스트, 출전 시간까지 자동으로 기록되는 나만의 축구 이력서. 프로처럼 내 기록을 확인하세요.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      details: ["실시간 경기 기록", "개인별 플레이 타임", "득점/어시스트 추적"],
    },
    {
      icon: Trophy,
      title: "우리만의 리그를 만들어요",
      description: "자동 순위표, 일정 관리, 득점왕 집계까지. 프로 리그처럼 즐기는 아마추어 축구.",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop",
      details: ["리그/토너먼트 생성", "자동 순위표 생성", "득점왕/도움왕 순위"],
    },
    {
      icon: PieChart,
      title: "데이터로 보는 나의 성장",
      description: "참가율, 득점 트렌드, 플레이어 궁합까지. 인포그래픽으로 확인하는 내 축구 인생.",
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop",
      details: ["시즌 요약 카드", "득점 기여도 분석", "플레이어 궁합 분석"],
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">이런 기능을 제공합니다</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${feature.image}')` }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mr-2" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
