import { Hero } from "@/components/home/Hero";
import { PlatformStats } from "@/components/home/PlatformStats";
import { FeaturedLeagues } from "@/components/home/FeaturedLeagues";
import { RecentResults } from "@/components/home/RecentResults";
import { KeyFeatures } from "@/components/home/KeyFeatures";
import { Testimonials } from "@/components/home/Testimonials";
import { TeamSearchPreview } from "@/components/home/TeamSearchPreview";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <PlatformStats />
      <FeaturedLeagues />
      <RecentResults />
      <KeyFeatures />
      <TeamSearchPreview />
      <Testimonials />
      <CTASection />
    </div>
  );
}
