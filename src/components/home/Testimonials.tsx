import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "김민수",
      team: "FC 강남",
      content: "경기마다 일일이 카톡으로 기록하던 시절은 이제 안녕! 앱에서 바로 득점 입력하고, 우리 팀 득점왕 순위 보는 재미가 쏠쏠해요.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "이지훈",
      team: "분당 FC",
      content: "팀 찾기 기능으로 우리 동네 팀 쉽게 찾았어요. 프로필에서 활동 시간이랑 수준 미리 확인할 수 있어서 좋았습니다.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "박준영",
      team: "서울 유나이티드",
      content: "리그 운영하면서 순위표 엑셀로 만들던 게 정말 번거로웠는데, 여기선 자동으로 다 정리돼요. 팀장으로서 강추합니다!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">이미 많은 팀이 함께하고 있습니다</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center mt-auto">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={testimonial.image} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-foreground">{testimonial.name}</div>
                    <p className="text-muted-foreground mb-4">&quot;{testimonial.content}&quot;</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
