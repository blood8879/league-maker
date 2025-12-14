import { TeamForm } from "@/components/teams/TeamForm";

export default function NewTeamPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">새로운 팀 생성</h1>
        <p className="text-muted-foreground">
          나만의 팀을 만들고 리그메이커에서 활동을 시작해보세요.
        </p>
      </div>
      
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <TeamForm />
      </div>
    </div>
  );
}
