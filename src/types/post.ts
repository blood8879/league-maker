// 게시글 카테고리
export type PostCategory = 'free' | 'recruitment' | 'mercenary' | 'review';

// 게시글
export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    nickname: string;
    avatar?: string;
    teamName?: string;
  };
  category: PostCategory;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  comments?: Comment[];

  // For mercenary posts
  mercenaryInfo?: {
    matchId: string;
    matchDate: string;
    matchTime: string;
    venue: string;
    positions: string[];
    level: string;
    status: 'open' | 'closed' | 'urgent';
    region: string;
  };
}

// 댓글
export interface Comment {
  id: string;
  author: {
    id: string;
    nickname: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likeCount: number;
}
