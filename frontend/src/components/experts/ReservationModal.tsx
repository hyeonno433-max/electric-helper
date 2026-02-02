import React, { useState, useEffect } from "react";
import { X, Calendar, Sparkles, Zap, Flame, Lightbulb, HelpCircle, Camera, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    expertName: string;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, onSubmit, expertName }) => {
    // Step Control
    const [step, setStep] = useState(1);

    // Step 1 Data (Diagnosis)
    const [category, setCategory] = useState<string | null>(null);
    const [desc, setDesc] = useState("");

    // Step 2 Data (Reservation)
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Initializer
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setCategory(null);
            setDesc("");
            setSelectedDate(null);
            setSelectedTime(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- Logic for Step 1 ---
    const categories = [
        { id: 'power_off', label: '차단기 내려감', icon: Zap },
        { id: 'burnt_smell', label: '탄내/소음', icon: Flame },
        { id: 'flickering', label: '전등/조명', icon: Lightbulb },
        { id: 'other', label: '기타 문의', icon: HelpCircle },
    ];

    const handleStep1Next = () => {
        if (!category) {
            alert("증상 분류를 선택해주세요.");
            return;
        }
        if (!desc.trim()) {
            alert("상세 설명을 입력해주세요.");
            return;
        }
        setStep(2);
    };

    // --- Logic for Step 2 ---
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const handleDateClick = (day: number) => {
        setSelectedDate(day);
    };

    const handleTimeClick = (time: string) => {
        if (time === "마감") return;
        setSelectedTime(time);
    };

    const handleQuickSelect = (type: 'today' | 'tomorrow' | 'weekend') => {
        const today = new Date(2026, 1, 1);
        if (type === 'today') setSelectedDate(today.getDate());
        if (type === 'tomorrow') setSelectedDate(today.getDate() + 1);
        if (type === 'weekend') setSelectedDate(7);
    };

    const handleFinalSubmit = () => {
        if (!selectedDate || !selectedTime) {
            alert("날짜와 시간을 선택해주세요.");
            return;
        }
        // Date formatting
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;

        // Pass all unified data
        onSubmit({
            category,
            description: desc,
            reservationDate: dateStr,
            reservationTime: selectedTime
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-[420px] bg-[#15161c] border border-gray-800 rounded-[32px] shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">
                            {step === 1 ? "무료 비대면 상담" : "방문 점검 예약"}
                        </h2>
                        <p className="text-gray-400 text-xs">
                            {step === 1
                                ? "사진을 분석하여 최적의 진단을 제공합니다."
                                : <span><span className="text-indigo-400 font-bold">{expertName}</span> 전문가에게 예약을 요청합니다.</span>
                            }
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-6">

                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">STEP 1. 증상 분류</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setCategory(cat.id)}
                                            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all aspect-square
                                                ${category === cat.id
                                                    ? 'bg-[#1c1d29] border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                                    : 'bg-[#0f1015] border-white/5 text-gray-500 hover:bg-[#1a1b24] hover:text-gray-300'
                                                }`}
                                        >
                                            <cat.icon className="w-6 h-6" />
                                            <span className="text-[10px] font-medium whitespace-nowrap">{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">STEP 2. 상세 설명 및 사진</label>
                                <textarea
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    placeholder="어떤 상황인지 자세히 적어주세요. (예: 인덕션 켤 때마다 주방 차단기가 내려가요)"
                                    className="w-full bg-[#0f1015] border border-white/5 rounded-2xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none h-32"
                                />

                                {/* Photo Upload Placeholder */}
                                <div className="border border-dashed border-white/10 bg-[#0f1015] rounded-2xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-[#1a1b24] hover:border-indigo-500/50 hover:text-indigo-400 transition-all cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-colors">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium">이곳을 눌러 사진을 등록해주세요 (0/5)</span>
                                    <span className="text-[10px] text-gray-600 mt-1">JPEG, PNG 가능 / 장당 10MB 이내</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            {/* Quick Filters */}
                            <div className="flex gap-2">
                                <button onClick={() => handleQuickSelect('today')} className="flex-1 py-2 rounded-full bg-indigo-600 text-white text-xs font-bold">오늘</button>
                                <button onClick={() => handleQuickSelect('tomorrow')} className="flex-1 py-2 rounded-full bg-[#1e2029] text-gray-400 hover:bg-gray-800 text-xs font-medium border border-white/5">내일</button>
                                <button onClick={() => handleQuickSelect('weekend')} className="flex-1 py-2 rounded-full bg-[#1e2029] text-gray-400 hover:bg-gray-800 text-xs font-medium border border-white/5">이번 주말</button>
                            </div>

                            {/* Date Picker */}
                            <div>
                                <div className="text-base font-bold text-white mb-3 pl-1">
                                    {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                                </div>
                                <div className="bg-white rounded-xl p-3 text-black shadow-lg">
                                    <div className="grid grid-cols-7 text-center mb-2">
                                        {['SU', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                            <div key={i} className={`text-[10px] font-bold ${i === 0 ? 'text-red-500' : 'text-gray-400'}`}>{day}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
                                        {Array.from({ length: firstDay }).map((_, i) => (
                                            <div key={`empty-${i}`} />
                                        ))}
                                        {Array.from({ length: daysInMonth }).map((_, i) => {
                                            const day = i + 1;
                                            const isSelected = selectedDate === day;
                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => handleDateClick(day)}
                                                    className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto transition-all text-sm
                                                        ${isSelected ? 'bg-indigo-600 text-white shadow-md font-bold' : 'text-gray-700 hover:bg-gray-100'}
                                                        ${(i + firstDay) % 7 === 0 ? 'text-red-500' : ''}
                                                    `}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Time Picker */}
                            <div className="grid grid-cols-4 gap-2">
                                {["10:00", "11:00", "12:00", "13:00", "마감", "14:00", "15:00", "16:00"].map((t, i) => (
                                    <button
                                        key={i}
                                        disabled={t === "마감"}
                                        onClick={() => handleTimeClick(t)}
                                        className={`py-2.5 rounded-xl text-xs font-bold transition-all
                                            ${t === "마감"
                                                ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                                                : selectedTime === t
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                                    : 'bg-[#2a2b36] text-gray-400 hover:bg-[#323340]'
                                            }
                                        `}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <div className="text-center text-[10px] text-gray-600">
                                점검은 약 30분 ~ 1시간 소요됩니다
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="pt-6 mt-2 border-t border-white/5">
                    {step === 1 ? (
                        <Button
                            onClick={handleStep1Next}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 text-lg rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
                        >
                            다음 단계로
                        </Button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="px-4 py-4 rounded-2xl bg-[#1e2029] text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <Button
                                onClick={handleFinalSubmit}
                                className="flex-1 bg-[#39FF14] hover:bg-[#32e612] text-black font-bold py-4 text-lg rounded-2xl shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                예약 요청하기 <Sparkles className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;
