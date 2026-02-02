"use client";

import Link from "next/link";
import { ArrowLeft, Star, ThumbsUp, MapPin, Award, MessageSquare } from "lucide-react";
import { useEffect, useState, Suspense } from "react";

function ExpertsContent() {
    const [experts, setExperts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/experts`)
            .then((res) => res.json())
            .then((data) => {
                setExperts(data);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-[#0A0B10] flex items-center justify-center text-white">Loading experts...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0A0B10] text-gray-100 p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center gap-4 mb-12">
                    <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                            전문가 매칭
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">검증된 국가 기술 자격증 소지자 목록입니다.</p>
                    </div>
                </header>

                <div className="grid gap-6">
                    {experts.map((expert: any) => (
                        <div key={expert.id} className="group bg-[#15161c] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row gap-6 hover:border-indigo-500/50 hover:bg-[#1a1b24] transition-all duration-300 shadow-lg">
                            {/* Profile Image & Badge */}
                            <div className="flex-shrink-0 relative">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-4xl shadow-inner border border-white/10">
                                    {expert.imageUrl ? <img src={expert.imageUrl} alt={expert.name} className="w-full h-full object-cover rounded-full" /> : '👨‍🔧'}
                                </div>
                                {expert.isCertified && (
                                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full border-4 border-[#15161c] tooltip" title="국가 공인 인증">
                                        <Award className="w-4 h-4" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                    <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                        {expert.name}
                                    </h2>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                                        {expert.specialty}
                                    </span>
                                </div>

                                <div className="flex items-center text-sm text-gray-400 mb-4 gap-4">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        {expert.region}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ThumbsUp className="w-4 h-4 text-gray-500" />
                                        리뷰 {expert.reviewCount}개
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 line-clamp-2">
                                    고객님의 안전을 최우선으로 생각합니다. 24시간 언제든 연락주시면 빠르게 달려가겠습니다.
                                    (상세 소개글은 추후 데이터 연동 예정)
                                </p>
                            </div>

                            {/* Action & Rating */}
                            <div className="flex flex-col items-end justify-between gap-4">
                                <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                    <span className="font-bold text-yellow-400 text-lg">{expert.rating}</span>
                                </div>

                                <Link href="/diagnosis">
                                    <button
                                        className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 whitespace-nowrap flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        전문가 진단
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ExpertsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0B10] flex items-center justify-center text-white">Loading...</div>}>
            <ExpertsContent />
        </Suspense>
    );
}
