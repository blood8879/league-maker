import { addDays, format, subHours } from 'date-fns';

export type PostCategory = 'free' | 'recruitment' | 'mercenary' | 'review';

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

const generateMockPosts = (): Post[] => {
  const posts: Post[] = [];
  const categories: PostCategory[] = ['free', 'recruitment', 'mercenary', 'review'];
  const regions = ['서울', '경기', '인천', '부산', '대구', '광주', '대전'];
  const positions = ['FW', 'MF', 'DF', 'GK', '윙어', '풀백'];
  const levels = ['입문', '초급', '중급', '상급', '최상급'];

  // Generate 40 posts
  for (let i = 1; i <= 40; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const isMercenary = category === 'mercenary';
    const date = subHours(new Date(), Math.floor(Math.random() * 168)); // Last 7 days

    const post: Post = {
      id: `post-${i}`,
      title: isMercenary 
        ? `[${regions[Math.floor(Math.random() * regions.length)]}] ${format(addDays(new Date(), Math.floor(Math.random() * 14)), 'MM/dd')} 용병 구합니다`
        : `커뮤니티 게시글 제목입니다 - ${i}`,
      content: `안녕하세요. 게시글 내용입니다. ${i}번째 게시글입니다. 즐거운 축구 하세요!`,
      author: {
        id: `user-${i}`,
        nickname: `User${i}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        teamName: Math.random() > 0.5 ? `Team ${i}` : undefined,
      },
      category,
      createdAt: date.toISOString(),
      viewCount: Math.floor(Math.random() * 1000),
      likeCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 20),
    };

    if (isMercenary) {
      const matchDate = addDays(new Date(), Math.floor(Math.random() * 14));
      post.mercenaryInfo = {
        matchId: `match-${i}`,
        matchDate: format(matchDate, 'yyyy-MM-dd'),
        matchTime: `${18 + Math.floor(Math.random() * 4)}:00`,
        venue: `${regions[Math.floor(Math.random() * regions.length)]} 풋살장`,
        positions: [positions[Math.floor(Math.random() * positions.length)]],
        level: levels[Math.floor(Math.random() * levels.length)],
        status: Math.random() > 0.8 ? 'urgent' : (Math.random() > 0.3 ? 'open' : 'closed'),
        region: regions[Math.floor(Math.random() * regions.length)],
      };
    }

    posts.push(post);
  }

  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const MOCK_POSTS = generateMockPosts();

export const getPosts = async (category?: string) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  if (!category || category === 'all') return MOCK_POSTS;
  return MOCK_POSTS.filter(post => post.category === category);
};

export const getPostById = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_POSTS.find(post => post.id === id);
};

export const getMercenaryPosts = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_POSTS.filter(post => post.category === 'mercenary');
};
