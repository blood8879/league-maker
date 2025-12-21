import { Metadata } from 'next';
import { UserProfile } from '@/components/profile/UserProfile';

export const metadata: Metadata = {
  title: '프로필 | League Maker',
  description: '사용자 프로필 정보',
};

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id: userId } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile userId={userId} />
    </div>
  );
}
