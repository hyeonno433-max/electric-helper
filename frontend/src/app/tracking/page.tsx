"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, MessageSquare, Wrench } from "lucide-react";

interface Diagnosis {
    id: number;
    status: string;
    createdAt: string;
    symptoms: string;
    description: string;
    aiAnalysis: string;
    riskScore: number;
    expertComment?: string;
    estimatedCost?: number;
    contact?: string; // Add contact to the interface
}

import { useModal } from "@/components/ui/ModalContext";
import { formatPhoneNumber } from "@/utils/formatters";

export default function TrackingPage() {
    const router = useRouter();
    const { openAlert, openConfirm } = useModal(); // Use modal hook
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchContact, setSearchContact] = useState("");
    const [viewMode, setViewMode] = useState<"SEARCH" | "LIST">("SEARCH");

    const handleSearchContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchContact(formatPhoneNumber(e.target.value));
    };

    const fetchDiagnoses = async () => {
        setLoading(true);
        try {
            // 전체 데이터를 가져와서 필터링 (프로토타입 단계)
            // 실제 운영 시에는 백엔드에 쿼리 파라미터로 전달해야 함 (?contact=...)
            const res = await fetch("http://localhost:8000/diagnosis");
            if (res.ok) {
                const data = await res.json();
                const filtered = data.filter((d: any) => d.contact === searchContact);

                // 최신순 정렬
                setDiagnoses(filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                setViewMode("LIST");
            }
        } catch (error) {
            console.error("Failed to fetch diagnoses", error);
            openAlert({
                title: "조회 오류",
                message: "조회 중 오류가 발생했습니다.",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status: string) => {
        switch (status) {
            case "RECEIPT": return 1;
            case "WAITING": return 2;
            case "ANSWERED": return 3;
            case "VISIT": return 4;
            default: return 1;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "RECEIPT": return "접수 완료";
            case "WAITING": return "상담 대기";
            case "ANSWERED": return "전문가 답변";
            case "VISIT": return "방문/시공";
            case "REJECTED": return "진단 종료";
            default: return "접수 완료";
        }
    };

    const handleStatusUpdate = async (id: number, status: "VISIT" | "REJECTED") => {
        const confirmed = await openConfirm({
            title: status === "VISIT" ? "방문 요청" : "진단 종료",
            message: status === "VISIT" ? "전문가 방문을 요청하시겠습니까?" : "진단을 종료하시겠습니까?",
            confirmText: status === "VISIT" ? "요청하기" : "종료하기",
            type: "confirm" // Use confirm type
        });

        if (!confirmed) return;

        try {
            const res = await fetch(`http://localhost:8000/diagnosis/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                openAlert({
                    title: status === "VISIT" ? "요청 완료" : "종료 완료",
                    message: status === "VISIT" ? "방문 요청이 접수되었습니다. 곧 연락드리겠습니다." : "진단이 종료되었습니다.",
                    type: "success"
                });
                fetchDiagnoses(); // Refresh list
            }
        } catch (error) {
            console.error("Failed to update status", error);
            openAlert({
                title: "처리 오류",
                message: "처리 중 오류가 발생했습니다.",
                type: "error"
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0B10] text-gray-100 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => {
                        if (viewMode === "LIST") setViewMode("SEARCH");
                        else router.back();
                    }} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold">내 접수 진행상황</h1>
                </div>

                {viewMode === "SEARCH" ? (
                    <div className="max-w-md mx-auto mt-20 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-[#15161c] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <h2 className="text-xl font-bold mb-2">접수/예약 조회</h2>
                            <p className="text-gray-400 text-sm mb-6">진단 접수 시 입력한 휴대폰 번호를 입력해주세요.</p>

                            <input
                                type="text"
                                value={searchContact}
                                onChange={handleSearchContactChange}
                                placeholder="010-0000-0000"
                                className="w-full p-4 bg-[#0A0B10] border border-white/10 rounded-xl text-center text-lg tracking-widest mb-4 focus:outline-none focus:border-indigo-500 transition-colors"
                            />

                            <button
                                onClick={fetchDiagnoses}
                                disabled={searchContact.length < 12 || loading}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "조회 중..." : "조회하기"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        {diagnoses.length === 0 ? (
                            <div className="text-center py-12 bg-[#15161c] rounded-3xl border border-white/5 shadow-2xl">
                                <p className="text-gray-400">조회된 접수 내역이 없습니다.</p>
                                <p className="text-gray-500 text-sm mt-2">정확한 휴대폰 번호를 입력했는지 확인해주세요.</p>
                            </div>
                        ) : (
                            diagnoses.map((item) => {
                                const currentStep = getStatusStep(item.status);
                                return (
                                    <div key={item.id} className="bg-[#15161c] p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                                        {item.status === "REJECTED" && (
                                            <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
                                                <div className="bg-[#1e1f29] px-6 py-4 rounded-xl border border-white/10 text-gray-400 font-bold">
                                                    진단이 종료되었습니다 (방문 거절)
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <span className="text-xs font-mono text-gray-500 block mb-1">{new Date(item.createdAt).toLocaleString()}</span>
                                                <h3 className="text-lg font-bold text-white mb-2">
                                                    {item.symptoms === "power_off" && "차단기 내려감"}
                                                    {item.symptoms === "burnt_smell" && "탄내/소음"}
                                                    {item.symptoms === "flickering" && "전등/조명"}
                                                    {item.symptoms === "other" && "기타 문의"}
                                                </h3>
                                                <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${item.status === 'ANSWERED' ? 'bg-indigo-900/50 text-indigo-300 border-indigo-500/30' :
                                                item.status === 'WAITING' ? 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30' :
                                                    item.status === 'VISIT' ? 'bg-green-900/50 text-green-400 border-green-500/30' :
                                                        'bg-gray-800 text-gray-400 border-gray-700'
                                                }`}>
                                                {getStatusLabel(item.status)}
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        <div className="relative mb-8">
                                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 rounded-full"></div>
                                            <div
                                                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 -translate-y-1/2 rounded-full transition-all duration-1000"
                                                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                                            ></div>

                                            <div className="relative flex justify-between w-full">
                                                {[
                                                    { step: 1, label: "접수완료", icon: CheckCircle2 },
                                                    { step: 2, label: "상담대기", icon: Clock },
                                                    { step: 3, label: "전문가답변", icon: MessageSquare }, // Fixed typo
                                                    { step: 4, label: "방문/시공", icon: Wrench },
                                                ].map((s) => (
                                                    <div key={s.step} className="flex flex-col items-center gap-2 group">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all ${currentStep >= s.step
                                                            ? "bg-[#0A0B10] border-indigo-500 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                                            : "bg-[#15161c] border-gray-700 text-gray-700"
                                                            }`}>
                                                            <s.icon className="w-4 h-4" />
                                                        </div>
                                                        <span className={`text-[10px] font-bold ${currentStep >= s.step ? "text-indigo-300" : "text-gray-600"
                                                            }`}>{s.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Expert Response Area */}
                                        {item.expertComment && (
                                            <div className="mt-6 bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-5 animate-in fade-in slide-in-from-top-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs">👨‍🔧</div>
                                                    <span className="text-sm font-bold text-indigo-300">박준형 마스터님의 답변</span>
                                                </div>
                                                <p className="text-sm text-gray-300 mb-4 whitespace-pre-wrap leading-relaxed">
                                                    {item.expertComment}
                                                </p>
                                                {item.estimatedCost && (
                                                    <div className="flex justify-between items-center border-t border-indigo-500/20 pt-3 mb-4">
                                                        <span className="text-sm text-gray-400">예상 견적</span>
                                                        <span className="text-lg font-bold text-white">{item.estimatedCost.toLocaleString()}원</span>
                                                    </div>
                                                )}

                                                {/* Customer Action Buttons */}
                                                {item.status === 'ANSWERED' && (
                                                    <div className="flex gap-2 mt-4 pt-4 border-t border-indigo-500/20">
                                                        <button
                                                            onClick={() => handleStatusUpdate(item.id, 'REJECTED')}
                                                            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-bold transition-colors"
                                                        >
                                                            방문 거절
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(item.id, 'VISIT')}
                                                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-indigo-500/20"
                                                        >
                                                            방문 요청하기
                                                        </button>
                                                    </div>
                                                )}

                                                {item.status === 'VISIT' && (
                                                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                                                        <p className="text-green-400 text-sm font-bold">방문 요청이 완료되었습니다.</p>
                                                        <p className="text-green-600/70 text-xs mt-1">전문가가 곧 연락드려 일정을 조율할 예정입니다.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            }))}
                    </div>
                )}
            </div>
        </div>
    );
}
