import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Standing } from "@/types/league";
import { cn } from "@/lib/utils";

interface LeagueStandingsProps {
  standings: Standing[];
}

export function LeagueStandings({ standings }: LeagueStandingsProps) {
  if (!standings || standings.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">순위 정보가 없습니다.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">순위</TableHead>
            <TableHead>팀</TableHead>
            <TableHead className="text-center">경기</TableHead>
            <TableHead className="text-center">승</TableHead>
            <TableHead className="text-center">무</TableHead>
            <TableHead className="text-center">패</TableHead>
            <TableHead className="text-center hidden md:table-cell">득점</TableHead>
            <TableHead className="text-center hidden md:table-cell">실점</TableHead>
            <TableHead className="text-center">득실</TableHead>
            <TableHead className="text-center font-bold">승점</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((standing) => (
            <TableRow key={standing.teamId}>
              <TableCell className="text-center font-medium">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs mx-auto",
                  standing.rank <= 3 ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                )}>
                  {standing.rank}
                </div>
              </TableCell>
              <TableCell className="font-medium">{standing.teamName}</TableCell>
              <TableCell className="text-center">{standing.matchesPlayed}</TableCell>
              <TableCell className="text-center text-blue-600">{standing.wins}</TableCell>
              <TableCell className="text-center text-gray-500">{standing.draws}</TableCell>
              <TableCell className="text-center text-red-500">{standing.losses}</TableCell>
              <TableCell className="text-center hidden md:table-cell">{standing.goalsFor}</TableCell>
              <TableCell className="text-center hidden md:table-cell">{standing.goalsAgainst}</TableCell>
              <TableCell className="text-center">{standing.goalDifference}</TableCell>
              <TableCell className="text-center font-bold text-lg">{standing.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
