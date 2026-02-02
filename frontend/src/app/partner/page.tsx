"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, Calendar, DollarSign, MessageSquare } from "lucide-react";

export default function PartnerPage() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Confirm Modal State
    const [selectedReservation, setSelectedReservation] = useState<any>(null);
    const [confirmDate, setConfirmDate] = useState("");
    const [estimatedCost, setEstimatedCost] = useState("");
    const [expertNote, setExpertNote] = useState("");

    const fetchReservations = () => {
        fetch("http://localhost:8000/reservations")
            .then(res => res.json())
            .then(data => {
                setReservations(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleOpenConfirm = (reservation: any) => {
        setSelectedReservation(reservation);
        // 기본값 세팅
        setConfirmDate(reservation.reservationDate); // 고객 희망 시간을 기본으로
        setEstimatedCost("50000");
        setExpertNote("기본 출장비 및 점검 비용 포함입니다.");
    };

    const handleConfirmSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedReservation) return;

        try {
            const res = await fetch(`http://localhost:8000/reservations/${selectedReservation.id}/confirm`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    confirmedDate: confirmDate,
                    estimatedCost: parseInt(estimatedCost),
                    expertNote: expertNote
                })
            });

            if (!res.ok) throw new Error("Confirm failed");

            alert("예약이 확정되었습니다!");
            setSelectedReservation(null);
            fetchReservations(); // 목록 갱신

        } catch (err) {
            console.error(err);
            alert("확정 처리에 실패했습니다.");
        }
    };

    if (loading) return <div className="p-10 text-white">Loading reservations...</div>;

    return (
        <div className="min-h-screen bg-[#0A0B10] text-gray-100 p-8 font-sans">
            <h1 className="text-3xl font-bold mb-8 text-indigo-400">파트너(전문가) 대시보드</h1>

            <div className="grid gap-6 max-w-5xl">
                {reservations.map((res) => (
                    <div key={res.id} className={`p-6 rounded-2xl border ${res.status === 'CONFIRMED' ? 'border-green-500/30 bg-green-900/10' : 'border-gray-700 bg-[#15161c]'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${res.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' :
                                    res.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-400'
                                    }`}>
                                    {res.status}
                                </span>
                                <h3 className="text-xl font-bold text-white">예약 요청 #{res.id}</h3>
                            </div>
                            <div className="text-right text-gray-400 text-sm">
                                {new Date(res.createdAt).toLocaleString()}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-900/50 p-4 rounded-xl">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-2">
                                    <Clock className="w-4 h-4 text-indigo-500" /> 고객 희망 일시
                                </h4>
                                <p className="text-lg">{res.reservationDate}</p>
                            </div>
                            <div className="bg-gray-900/50 p-4 rounded-xl">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-2">
                                    <MessageSquare className="w-4 h-4 text-indigo-500" /> 요청 사항
                                </h4>
                                <p className="text-gray-300">{res.description}</p>
                            </div>
                        </div>

                        {res.status !== 'CONFIRMED' && (
                            <button
                                onClick={() => handleOpenConfirm(res)}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                예약 확정 및 견적 입력
                            </button>
                        )}

                        {res.status === 'CONFIRMED' && (
                            <div className="border-t border-gray-700 pt-4 mt-4">
                                <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> 확정된 정보
                                </h4>
                                <div className="text-sm space-y-1 text-gray-300">
                                    <p>방문 일시: <span className="text-white font-bold">{res.confirmedDate}</span></p>
                                    <p>예상 견적: <span className="text-white font-bold">{res.estimatedCost?.toLocaleString()}원</span></p>
                                    <p>전문가 메모: {res.expertNote}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {reservations.length === 0 && (
                    <p className="text-gray-500 text-center py-20">아직 예약 요청이 없습니다.</p>
                )}
            </div>

            {/* Confirm Modal */}
            {selectedReservation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1b24] p-8 rounded-2xl w-full max-w-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-6 text-white">예약 확정</h2>
                        <form onSubmit={handleConfirmSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">방문 확정 일시</label>
                                <input
                                    type="text"
                                    value={confirmDate}
                                    onChange={(e) => setConfirmDate(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">예상 견적 금액 (원)</label>
                                <input
                                    type="number"
                                    value={estimatedCost}
                                    onChange={(e) => setEstimatedCost(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">전문가 코멘트</label>
                                <textarea
                                    value={expertNote}
                                    onChange={(e) => setExpertNote(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white h-24 resize-none"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setSelectedReservation(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-bold">
                                    취소
                                </button>
                                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold">
                                    확정 전송
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
