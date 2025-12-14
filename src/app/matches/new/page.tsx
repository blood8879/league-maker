import { MatchCreationForm } from "@/components/matches/MatchCreationForm";

export default function MatchCreationPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">새 경기 생성</h1>
      <MatchCreationForm />
    </div>
  );
}
