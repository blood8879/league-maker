import { MOCK_TEAMS } from "@/lib/mock-data";
import { TeamProfile } from "@/components/teams/TeamProfile";
import { MemberList } from "@/components/teams/MemberList";
import { notFound } from "next/navigation";

interface TeamDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { id } = await params;
  const team = MOCK_TEAMS.find((t) => t.id === id);

  if (!team) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TeamProfile team={team} />
      <MemberList members={team.members} />
    </div>
  );
}
