"use client";

import React, { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Users,
    Settings,
    Search,
    Bell,
    FileText,
    Image as ImageIcon,
    Phone,
    Clock,
    CheckCircle2,
    AlertCircle,
    Send,
    DollarSign,
    MessageSquare,
    Calendar,
    XCircle
} from "lucide-react";
import { useModal } from "@/components/ui/ModalContext";

interface Diagnosis {
    id: number;
    status: string;
    createdAt: string;
    symptoms: string;
    description: string;
    name: string;
    contact: string;
    imageUrl: string[];
    expertComment?: string;
    estimatedCost?: number;
}

export default function ExpertDashboard() {
    const { openAlert } = useModal();
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const [cost, setCost] = useState("");

    useEffect(() => {
        fetchDiagnoses();
    }, []);

    const fetchDiagnoses = async () => {
        try {
            const res = await fetch("http://localhost:8000/diagnosis");
            if (res.ok) {
                const data = await res.json();
                setDiagnoses(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            }
        } catch (error) {
            console.error("Failed to fetch diagnoses:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedId) return;

        try {
            const res = await fetch(`http://localhost:8000/diagnosis/${selectedId}/response`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    expertComment: comment,
                    estimatedCost: parseInt(cost.replace(/,/g, "")),
                }),
            });

            if (res.ok) {
                openAlert({
                    title: "등록 완료",
                    message: "답변이 성공적으로 등록되었습니다.",
                    type: "success"
                });
                fetchDiagnoses();
                // 유지: 선택된 상태 유지하여 결과 확인 가능하게 하거나, 필요 시 초기화
                // setSelectedId(null); 
                setComment("");
                setCost("");
            } else {
                openAlert({
                    title: "등록 실패",
                    message: "등록 중 오류가 발생했습니다.",
                    type: "error"
                });
            }
        } catch (err) {
            console.error(err);
            openAlert({
                title: "오류 발생",
                message: "서버 연결에 실패했습니다.",
                type: "error"
            });
        }
    };

    const formatCurrency = (value: string) => {
        const number = parseInt(value.replace(/,/g, ""));
        if (isNaN(number)) return "";
        return number.toLocaleString();
    };

    const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCost(formatCurrency(e.target.value));
    };

    const selectedDiagnosis = diagnoses.find(d => d.id === selectedId);

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
            {/* 1. Left Sidebar (Navigation) */}
            <nav className="w-20 flex-none border-r border-slate-800 flex flex-col items-center py-8 gap-8 bg-slate-950 z-20">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                    <LayoutDashboard size={22} />
                </div>
                <div className="flex flex-col gap-6 w-full items-center flex-1">
                    <button className="p-3 text-slate-400 hover:text-indigo-400 hover:bg-slate-900 rounded-xl transition-all group relative">
                        <Users size={22} />
                        <span className="absolute left-14 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 pointer-events-none">고객 관리</span>
                    </button>
                    <button className="p-3 text-slate-400 hover:text-indigo-400 hover:bg-slate-900 rounded-xl transition-all group relative">
                        <Bell size={22} />
                        <span className="absolute left-14 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 pointer-events-none">알림</span>
                    </button>
                    <button className="p-3 text-slate-400 hover:text-indigo-400 hover:bg-slate-900 rounded-xl transition-all group relative">
                        <Settings size={22} />
                        <span className="absolute left-14 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 pointer-events-none">설정</span>
                    </button>
                </div>
                <div className="mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-slate-800"></div>
                </div>
            </nav>

            {/* 2. Center List (Inbox) */}
            <div className="w-96 flex-none border-r border-slate-800 flex flex-col bg-slate-950/50 backdrop-blur-sm z-10">
                <div className="p-6 border-b border-slate-800 bg-slate-950/80 sticky top-0 backdrop-blur">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-100">민원 접수</h2>
                        <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-full font-medium">{diagnoses.length}건</span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="고객명, 증상 검색..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {diagnoses.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedId(item.id)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${selectedId === item.id
                                ? "bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                                : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                                }`}
                        >
                            {selectedId === item.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                            )}
                            <div className="flex justify-between items-start mb-2 pl-2">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide ${item.status === 'ANSWERED'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : item.status === 'VISIT'
                                        ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                                        : item.status === 'REJECTED'
                                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}>
                                    {item.status === 'ANSWERED' ? '답변완료' : (item.status === 'VISIT' ? '방문요청' : (item.status === 'REJECTED' ? '방문취소' : '접수대기'))}
                                </span>
                                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="pl-2">
                                <h3 className={`font-bold text-sm mb-1 ${selectedId === item.id ? "text-indigo-300" : "text-slate-300"}`}>
                                    {item.name} 고객님
                                </h3>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Right Detail (Workspace) */}
            <main className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
                {selectedDiagnosis ? (
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-5xl mx-auto p-8 h-full flex flex-col">
                            {/* Header */}
                            <header className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                                            {selectedDiagnosis.name} <span className="text-lg font-normal text-slate-500">고객님의 민원 내역</span>
                                        </h1>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1"><Phone size={14} className="text-indigo-400" /> {selectedDiagnosis.contact}</span>
                                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                        <span className="flex items-center gap-1"><Clock size={14} className="text-indigo-400" /> {new Date(selectedDiagnosis.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {selectedDiagnosis.status === 'ANSWERED' ? (
                                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                                            <CheckCircle2 size={18} />
                                            <span className="font-bold text-sm">처리 완료</span>
                                        </div>
                                    ) : selectedDiagnosis.status === 'VISIT' ? (
                                        <div className="flex items-center gap-2 text-violet-400 bg-violet-500/10 px-4 py-2 rounded-full border border-violet-500/20">
                                            <Calendar size={18} />
                                            <span className="font-bold text-sm">방문 요청됨</span>
                                        </div>
                                    ) : selectedDiagnosis.status === 'REJECTED' ? (
                                        <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20">
                                            <XCircle size={18} />
                                            <span className="font-bold text-sm">방문 취소됨</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
                                            <AlertCircle size={18} />
                                            <span className="font-bold text-sm">답변 대기중</span>
                                        </div>
                                    )}
                                </div>
                            </header>

                            <div className="grid grid-cols-12 gap-8 flex-1">
                                {/* Left Column: Customer Content (7/12) */}
                                <div className="col-span-7 space-y-6">
                                    {/* Symptoms Card */}
                                    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
                                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <FileText size={16} className="text-indigo-500" /> 상세 접수 내용
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs text-slate-500 block mb-1.5">증상 유형</label>
                                                <div className="inline-block px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 shadow-inner">
                                                    {(() => {
                                                        const s = selectedDiagnosis.symptoms;
                                                        if (s === "power_off") return "차단기 내려감";
                                                        if (s === "burnt_smell") return "탄내/소음";
                                                        if (s === "flickering") return "전등/조명";
                                                        if (s === "other") return "기타 문의";
                                                        return s;
                                                    })()}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 block mb-1.5">고객 설명</label>
                                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 leading-relaxed min-h-[120px] shadow-inner whitespace-pre-wrap">
                                                    {selectedDiagnosis.description}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Images Card */}
                                    {selectedDiagnosis.imageUrl && selectedDiagnosis.imageUrl.length > 0 && (
                                        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <ImageIcon size={16} className="text-indigo-500" /> 현장 사진
                                            </h3>
                                            <div className="grid grid-cols-3 gap-3">
                                                {selectedDiagnosis.imageUrl.map((url, idx) => (
                                                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500 hover:ring-2 ring-indigo-500/20 transition-all group">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={url} alt={`현장사진-${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </a>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                {/* Right Column: Expert Response (5/12) - Sticky */}
                                <div className="col-span-5 relative">
                                    <div className="sticky top-0 space-y-4">
                                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-2xl shadow-black/50">
                                            <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-5 rounded-xl border border-indigo-500/10">
                                                <h3 className="text-lg font-bold text-indigo-300 mb-6 flex items-center gap-2">
                                                    <MessageSquare size={18} /> 답변 및 견적 작성
                                                </h3>
                                                {selectedDiagnosis.expertComment ? (
                                                    <div className="space-y-6">
                                                        <div className="bg-slate-950/80 rounded-xl p-4 border border-indigo-500/20">
                                                            <h4 className="text-xs font-semibold text-indigo-400 mb-2">보낸 전문가 소견</h4>
                                                            <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                                                                {selectedDiagnosis.expertComment}
                                                            </p>
                                                        </div>
                                                        <div className="bg-slate-950/80 rounded-xl p-4 border border-indigo-500/20 flex justify-between items-center">
                                                            <span className="text-xs font-semibold text-indigo-400">제안 견적가</span>
                                                            <span className="text-lg font-bold text-white">
                                                                {selectedDiagnosis.estimatedCost?.toLocaleString()} 원
                                                            </span>
                                                        </div>
                                                        <div className="pt-4 border-t border-indigo-500/10 text-center">
                                                            <p className="text-xs text-slate-500">이미 답변이 전송되었습니다.</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={handleSubmit} className="space-y-5">
                                                        <div className="group">
                                                            <label className="block text-xs font-semibold text-slate-500 mb-2 group-focus-within:text-indigo-400 transition-colors">
                                                                전문가 소견
                                                            </label>
                                                            <textarea
                                                                value={comment}
                                                                onChange={(e) => setComment(e.target.value)}
                                                                className="w-full h-40 bg-slate-950 border border-slate-700 rounded-xl p-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:bg-slate-950/80 transition-all text-sm text-slate-200 placeholder:text-slate-700 resize-none shadow-inner"
                                                                placeholder="고객님의 문제에 대한 진단과 해결 방안을 자세히 적어주세요."
                                                                required
                                                            />
                                                        </div>
                                                        <div className="group">
                                                            <label className="block text-xs font-semibold text-slate-500 mb-2 group-focus-within:text-indigo-400 transition-colors">
                                                                예상 견적 (원)
                                                            </label>
                                                            <div className="relative">
                                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                                                                <input
                                                                    type="text"
                                                                    value={cost}
                                                                    onChange={handleCostChange}
                                                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:bg-slate-950/80 transition-all text-sm text-slate-100 font-mono tracking-wide placeholder:text-slate-700 shadow-inner"
                                                                    placeholder="50,000"
                                                                />
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transform hover:-translate-y-0.5 active:translate-y-0"
                                                        >
                                                            <Send className="w-4 h-4" /> 답변 및 견적 발송
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
                            <LayoutDashboard size={32} className="opacity-50" />
                        </div>
                        <p className="text-lg font-medium">처리할 민원을 좌측 목록에서 선택해주세요.</p>
                        <p className="text-sm">현재 대기 중인 민원이 <span className="text-indigo-400 font-bold">{diagnoses.length}</span>건 있습니다.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
