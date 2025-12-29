"use client";

import { Member } from "@/types/team";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { hasTeamManagementPermission, updateTeamMemberRole } from "@/lib/supabase/queries/teams";

interface MemberListProps {
  members: Member[];
  teamId: string;
}

export function MemberList({ members, teamId }: MemberListProps) {
  const { user } = useAuth();
  const [canManage, setCanManage] = useState(false);
  const [localMembers, setLocalMembers] = useState(members);
  const [updating, setUpdating] = useState<string | null>(null);

  // Check if current user can manage team members
  useEffect(() => {
    async function checkPermission() {
      if (!user) {
        setCanManage(false);
        return;
      }
      const hasPermission = await hasTeamManagementPermission(teamId, user.id);
      setCanManage(hasPermission);
    }
    checkPermission();
  }, [user, teamId]);

  // Update local members when props change
  useEffect(() => {
    setLocalMembers(members);
  }, [members]);

  // Sort members: Captain -> Coach -> Manager -> Member
  const sortedMembers = [...localMembers].sort((a, b) => {
    const roleOrder = { captain: 0, coach: 1, manager: 2, member: 3 };
    return roleOrder[a.role] - roleOrder[b.role];
  });

  const handleRoleChange = async (memberId: string, newRole: 'captain' | 'coach' | 'manager' | 'member') => {
    setUpdating(memberId);

    // Optimistic update
    setLocalMembers(prev =>
      prev.map(m => m.id === memberId ? { ...m, role: newRole } : m)
    );

    try {
      await updateTeamMemberRole({
        memberId,
        teamId,
        newRole
      });

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Failed to update member role:', error);

      // Revert on error
      setLocalMembers(members);

      alert('역할 변경 중 오류가 발생했습니다.');
    } finally {
      setUpdating(null);
    }
  };

  const getRoleBadge = (role: 'captain' | 'coach' | 'manager' | 'member') => {
    switch (role) {
      case 'captain':
        return <Badge variant="default" className="text-[10px] px-1 py-0 h-5">주장</Badge>;
      case 'coach':
        return <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5 bg-blue-100 text-blue-700 hover:bg-blue-200">코치</Badge>;
      case 'manager':
        return <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5 bg-purple-100 text-purple-700 hover:bg-purple-200">감독</Badge>;
      default:
        return null;
    }
  };

  const getRoleLabel = (role: 'captain' | 'coach' | 'manager' | 'member') => {
    switch (role) {
      case 'captain': return '주장';
      case 'coach': return '코치';
      case 'manager': return '감독';
      case 'member': return '멤버';
    }
  };

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
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{member.name}</span>
                  {!canManage && getRoleBadge(member.role)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {member.position} • No.{member.number}
                </div>
              </div>
              {canManage && (
                <div className="ml-auto">
                  <Select
                    value={member.role}
                    onValueChange={(value) => handleRoleChange(member.id, value as 'captain' | 'coach' | 'manager' | 'member')}
                    disabled={updating === member.id}
                  >
                    <SelectTrigger className="w-[110px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="captain">주장</SelectItem>
                      <SelectItem value="coach">코치</SelectItem>
                      <SelectItem value="manager">감독</SelectItem>
                      <SelectItem value="member">멤버</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
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
