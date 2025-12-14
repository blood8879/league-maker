import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

export function LiveRankings() {
  const topScorers = [
    { rank: 1, name: "김철수", team: "FC 강남", goals: 12, assists: 3, change: "up" },
    { rank: 2, name: "이영희", team: "송파 유나이티드", goals: 10, assists: 5, change: "same" },
    { rank: 3, name: "박민수", team: "분당 위너스", goals: 9, assists: 2, change: "down" },
    { rank: 4, name: "최준호", team: "판교 테크", goals: 8, assists: 4, change: "up" },
    { rank: 5, name: "정우성", team: "마포 시티", goals: 7, assists: 1, change: "same" },
  ];

  const teamRankings = [
    { rank: 1, name: "FC 강남", points: 24, record: "8승 0무 1패", form: ["W", "W", "W", "W", "L"], change: "same" },
    { rank: 2, name: "송파 유나이티드", points: 21, record: "7승 0무 2패", form: ["W", "W", "L", "W", "W"], change: "up" },
    { rank: 3, name: "분당 위너스", points: 19, record: "6승 1무 2패", form: ["W", "D", "W", "L", "W"], change: "down" },
    { rank: 4, name: "판교 테크", points: 15, record: "5승 0무 4패", form: ["L", "W", "W", "L", "W"], change: "up" },
    { rank: 5, name: "마포 시티", points: 12, record: "4승 0무 5패", form: ["L", "L", "W", "W", "L"], change: "same" },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-400 hover:bg-yellow-500 text-black">1</Badge>;
    if (rank === 2) return <Badge className="bg-gray-300 hover:bg-gray-400 text-black">2</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600 hover:bg-amber-700 text-white">3</Badge>;
    return <span className="font-bold text-gray-500 ml-2">{rank}</span>;
  };

  const getChangeIcon = (change: string) => {
    if (change === "up") return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (change === "down") return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8">실시간 랭킹</h2>
        
        <Tabs defaultValue="scorers" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="scorers">득점왕 랭킹</TabsTrigger>
            <TabsTrigger value="teams">팀 파워 랭킹</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scorers">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">순위</TableHead>
                    <TableHead>선수</TableHead>
                    <TableHead className="hidden md:table-cell">소속 팀</TableHead>
                    <TableHead className="text-right">골</TableHead>
                    <TableHead className="text-right hidden md:table-cell">어시스트</TableHead>
                    <TableHead className="text-center w-[80px]">변동</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topScorers.map((player) => (
                    <TableRow key={player.rank}>
                      <TableCell className="font-medium">{getRankBadge(player.rank)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`} />
                            <AvatarFallback>{player.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-semibold">{player.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{player.team}</TableCell>
                      <TableCell className="text-right font-bold text-primary text-lg">{player.goals}</TableCell>
                      <TableCell className="text-right hidden md:table-cell">{player.assists}</TableCell>
                      <TableCell className="text-center flex justify-center items-center h-14">
                        {getChangeIcon(player.change)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="teams">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">순위</TableHead>
                    <TableHead>팀</TableHead>
                    <TableHead className="text-center">승점</TableHead>
                    <TableHead className="hidden md:table-cell text-center">기록</TableHead>
                    <TableHead className="hidden md:table-cell text-center">최근 5경기</TableHead>
                    <TableHead className="text-center w-[80px]">변동</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamRankings.map((team) => (
                    <TableRow key={team.rank}>
                      <TableCell className="font-medium">{getRankBadge(team.rank)}</TableCell>
                      <TableCell className="font-semibold">{team.name}</TableCell>
                      <TableCell className="text-center font-bold text-primary text-lg">{team.points}</TableCell>
                      <TableCell className="hidden md:table-cell text-center text-muted-foreground">{team.record}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex justify-center gap-1">
                          {team.form.map((result, i) => (
                            <span 
                              key={i} 
                              className={`flex items-center justify-center w-6 h-6 rounded text-xs text-white font-bold
                                ${result === 'W' ? 'bg-green-500' : result === 'D' ? 'bg-gray-400' : 'bg-red-500'}`}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center flex justify-center items-center h-14">
                        {getChangeIcon(team.change)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
