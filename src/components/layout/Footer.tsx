import Link from "next/link";
import { Facebook, Instagram, Youtube, MessageCircle, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-bold mb-4">League Maker</h3>
            <p className="text-gray-400 text-sm mb-4">
              아마추어 풋살 & 축구 리그 관리 플랫폼
            </p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><span className="text-gray-500 cursor-not-allowed">회사 소개 (준비중)</span></li>
              <li>
                <a href="mailto:support@leaguemaker.com" className="hover:text-white transition-colors">
                  문의하기
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">약관 및 정책</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><span className="text-gray-500 cursor-not-allowed">이용약관 (준비중)</span></li>
              <li><span className="text-gray-500 cursor-not-allowed">개인정보 처리방침 (준비중)</span></li>
              <li><span className="text-gray-500 cursor-not-allowed">커뮤니티 가이드 (준비중)</span></li>
            </ul>
          </div>

          {/* Column 3: Sitemap */}
          <div>
            <h3 className="text-lg font-bold mb-4">사이트맵</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/teams" className="hover:text-white transition-colors">팀 찾기</Link></li>
              <li><Link href="/leagues" className="hover:text-white transition-colors">대회</Link></li>
              <li><Link href="/matches" className="hover:text-white transition-colors">경기 관리</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">커뮤니티</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">고객 지원</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><span className="text-gray-500 cursor-not-allowed">자주 묻는 질문 (준비중)</span></li>
              <li><span className="text-gray-500 cursor-not-allowed">고객센터 (준비중)</span></li>
              <li>
                <a href="mailto:support@leaguemaker.com" className="hover:text-white transition-colors flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  support@leaguemaker.com
                </a>
              </li>
              <li>
                <a href="tel:02-1234-5678" className="hover:text-white transition-colors flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  02-1234-5678
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4">소셜 미디어</h3>
            <p className="text-gray-400 text-sm mb-4">
              최신 소식을 확인하세요
            </p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com/leaguemaker" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://facebook.com/leaguemaker" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://youtube.com/@leaguemaker" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-6 w-6" />
                <span className="sr-only">Youtube</span>
              </Link>
              <Link href="https://pf.kakao.com/leaguemaker" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <MessageCircle className="h-6 w-6" />
                <span className="sr-only">KakaoTalk</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
            <p>© 2025 League Maker. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="cursor-not-allowed">이용약관 (준비중)</span>
              <span className="cursor-not-allowed">개인정보처리방침 (준비중)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
