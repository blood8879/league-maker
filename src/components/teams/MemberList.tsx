import { Member } from "@/types/team";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MemberListProps {
  members: Member[];
}

export function MemberList({ members }: MemberListProps) {
  // Sort members: Captain -> Vice-Captain -> Member
  const sortedMembers = [...members].sort((a, b) => {
    const roleOrder = { captain: 0, vice_captain: 1, member: 2 };
    return roleOrder[a.role] - roleOrder[b.role];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>팀 멤버 ({members.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Avatar>
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{member.name}</span>
                  {member.role === "captain" && (
                    <Badge variant="default" className="text-[10px] px-1 py-0 h-5">
                      주장
                    </Badge>
                  )}
                  {member.role === "vice_captain" && (
                    <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5">
                      부주장
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {member.position} • No.{member.number}
                </div>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              등록된 멤버가 없습니다.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
