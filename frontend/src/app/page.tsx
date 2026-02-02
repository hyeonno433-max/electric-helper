import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Camera, CheckCircle2, ChevronDown, ChevronRight, Phone, ShieldCheck, Zap } from "lucide-react";
import { FAQSection } from "@/components/home/FAQSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0B10] text-gray-100 font-sans selection:bg-indigo-500/30">
      {/* --- HERO SECTION --- */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8 animate-in slide-in-from-left duration-700">
          <div className="inline-flex items-center space-x-2 text-indigo-400 font-bold tracking-widest text-sm uppercase">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            <span>Real-Time Briefing</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight italic tracking-tighter">
            전기 불안,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 mr-4 pr-1 py-2">
              일렉트릭 헬퍼
            </span>
            가<br />
            해결합니다.
          </h1>
          <p className="text-gray-400 text-lg lg:text-xl max-w-md leading-relaxed">
            가장 가까운 검증된 전문가가 24시간 대기 중입니다.<br className="hidden lg:block" />
            지금 바로 진단을 시작하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/diagnosis">
              <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2">
                전문가 진단 접수 <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/tracking">
              <button className="px-8 py-4 border border-white/10 hover:bg-white/5 text-gray-300 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2">
                내 접수 진행상황 <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Content (Safety Score Card) */}
        <div className="relative animate-in slide-in-from-right duration-700 delay-200">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-xs text-gray-400 font-bold tracking-wider uppercase mb-1">Safety Score</p>
                <h3 className="text-4xl font-bold text-blue-400">안전도 95%</h3>
              </div>
              <ShieldCheck className="w-12 h-12 text-blue-500/50" />
            </div>

            {/* Simulated Graph Area */}
            <div className="h-40 flex items-end justify-between gap-2 mb-6 px-2">
              {[40, 65, 45, 80, 55, 90, 95].map((h, i) => (
                <div key={i} className="w-full bg-blue-500/20 rounded-t-lg relative group overflow-hidden" style={{ height: `${h}%` }}>
                  <div className="absolute bottom-0 w-full bg-blue-500/40 h-0 transition-all duration-1000 group-hover:h-full" style={{ height: `${h}%` }}></div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-300">
                <span>누전 위험성</span>
                <span className="text-neon-green font-bold">낮음</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-neon-green w-[5%] rounded-full shadow-[0_0_10px_#39FF14]"></div>
              </div>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                이 수치는 최근 30일간의 차단기 작동 데이터와 주변 지역 사고 이력을 기반으로 산출되었습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROCESS SECTION --- */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-2 italic">스마트 비대면 진단 서비스</h2>
        <p className="text-gray-400 mb-16">방문 전, 사진 한 도로 위험을 예측합니다.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "01", title: "사진 촬영", desc: "차단기 함 또는 문제 부위를 찍어주세요.", icon: <Camera className="w-8 h-8 text-blue-400" /> },
            { step: "02", title: "증상 선택", desc: "소음, 탄 냄새 등 현상을 체크하세요.", icon: <CheckCircle2 className="w-8 h-8 text-indigo-400" /> },
            { step: "03", title: "AI 분석", desc: "알고리즘이 원인과 위험도를 분석합니다.", icon: <Zap className="w-8 h-8 text-yellow-400" /> },
            { step: "04", title: "전문가 연결", desc: "분석 결과를 바탕으로 최적의 기술자 매칭", icon: <Phone className="w-8 h-8 text-green-400" /> },
          ].map((item, idx) => (
            <div key={idx} className="group p-8 rounded-2xl bg-[#111218] border border-white/5 hover:border-indigo-500/50 transition-all hover:-translate-y-2 hover:shadow-xl">
              <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center mb-6 mx-auto group-hover:bg-indigo-500/20 transition-colors">
                <span className="text-blue-500 font-bold">{item.step}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- EXPERTS SECTION --- */}
      <section className="w-full bg-[#0d0e14] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold italic mb-2">내 주변 국가공인 기술자</h2>
              <p className="text-gray-400">실제 이용자가 검증한 별점과 리뷰를 확인하세요.</p>
            </div>
            <Link href="/experts" className="hidden md:flex items-center text-blue-400 hover:text-blue-300 font-bold text-sm tracking-widest uppercase gap-2 group">
              View All Experts <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Expert Card 1 */}
            <div className="flex items-center p-6 bg-[#15161c] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-16 h-16 rounded-full bg-indigo-900/50 flex items-center justify-center text-2xl mr-6">👨‍🔧</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold">박준형 마스터</h3>
                  <span className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded font-bold border border-blue-500/20">NATIONAL CERTIFIED</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">"성남 지역 누전 수리 1위 (2025)"</p>
                <span className="text-[10px] text-gray-400 border border-gray-700 px-2 py-1 rounded-full">CONSULTING</span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-400 font-bold text-xl">
                  <Zap className="w-4 h-4 fill-yellow-400" /> 4.9 <span className="text-sm text-gray-600 font-normal">/5.0</span>
                </div>
              </div>
            </div>

            {/* Expert Card 2 */}
            <div className="flex items-center p-6 bg-[#15161c] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-16 h-16 rounded-full bg-yellow-900/30 flex items-center justify-center text-2xl mr-6">🛠️</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold">김철수 기술사</h3>
                </div>
                <p className="text-xs text-gray-500 mb-2">"노후 아파트 전기 배선 전문 교체 전문"</p>
                <span className="text-[10px] text-gray-400 border border-gray-700 px-2 py-1 rounded-full">CONSULTING</span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-400 font-bold text-xl">
                  <Zap className="w-4 h-4 fill-yellow-400" /> 5.0 <span className="text-sm text-gray-600 font-normal">/5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <FAQSection />

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-white/5 py-12 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] text-gray-500 mb-1">© 2026 ELECTRIC HELPER PRO. All rights reserved.</p>
            <p className="text-xs font-bold text-blue-900/50">SECURITY FOR YENA'S HOME</p>
          </div>
          <div className="flex gap-8 text-[10px] font-bold text-gray-500 tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">PRIVACY</Link>
            <Link href="#" className="hover:text-white transition-colors">TERMS</Link>
            <Link href="#" className="hover:text-white transition-colors">CONTACT</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
