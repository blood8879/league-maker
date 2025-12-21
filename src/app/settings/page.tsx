import { Metadata } from 'next';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';

export const metadata: Metadata = {
  title: '설정 | League Maker',
  description: '프로필 설정 및 수정',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">설정</h1>
        <ProfileEditForm />
      </div>
    </div>
  );
}
