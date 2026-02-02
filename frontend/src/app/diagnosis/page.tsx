"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plug, Flame, Lightbulb, HelpCircle, Camera } from "lucide-react";
import { useModal } from "@/components/ui/ModalContext";
import { formatPhoneNumber } from "@/utils/formatters";

export default function DiagnosisPage() {
    const router = useRouter();
    const { openAlert } = useModal();
    const [loading, setLoading] = useState(false);

    // Form State
    const [symptom, setSymptom] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");

    const handleSubmit = async () => {
        if (!symptom || !description || !name || !contact) {
            openAlert({
                title: "입력 확인",
                message: "모든 필수 항목을 입력해주세요.",
                type: "error"
            });
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("symptoms", symptom);
            formData.append("description", description);
            formData.append("name", name);
            formData.append("contact", contact);

            // 이미지 파일 추가
            images.forEach(file => {
                formData.append("files", file);
            });

            const response = await fetch("http://localhost:8000/diagnosis", {
                method: "POST",
                // Content-Type 헤더는 FormData 전송 시 자동으로 설정되므로 생략해야 함
                body: formData,
            });

            if (response.ok) {
                openAlert({
                    title: "접수 완료",
                    message: "진단이 성공적으로 접수되었습니다!",
                    type: "success"
                });
                router.push("/");
            } else {
                openAlert({
                    title: "접수 오류",
                    message: "접수 중 오류가 발생했습니다.",
                    type: "error"
                });
            }
        } catch (error) {
            console.error(error);
            openAlert({
                title: "네트워크 오류",
                message: "서버 연결에 실패했습니다.",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContact(formatPhoneNumber(e.target.value));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // 최대 5장 제한 체크
            if (images.length + newFiles.length > 5) {
                openAlert({
                    title: "업로드 제한",
                    message: "최대 5장까지 업로드 가능합니다.",
                    type: "error"
                });
                return;
            }
            setImages(prev => [...prev, ...newFiles]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const symptoms = [
        { id: "power_off", label: "차단기 내려감", icon: <Plug className="w-8 h-8 mb-2 text-gray-400" /> },
        { id: "burnt_smell", label: "탄내/소음", icon: <Flame className="w-8 h-8 mb-2 text-orange-500" /> },
        { id: "flickering", label: "전등/조명", icon: <Lightbulb className="w-8 h-8 mb-2 text-yellow-400" /> },
        { id: "other", label: "기타 문의", icon: <HelpCircle className="w-8 h-8 mb-2 text-red-500" /> },
    ];

    return (
        <div className="min-h-screen bg-[#0A0B10] flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#15161c] rounded-3xl overflow-hidden shadow-2xl relative border border-white/5 animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-[#15161c] p-6 text-white relative border-b border-white/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">무료 비대면 상담</h1>
                            <p className="text-gray-400 text-sm">사진을 분석하여 최적의 진단을 제공합니다.</p>
                        </div>
                        <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {/* Step 1: 증상 분류 */}
                    <section>
                        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-4">STEP 1. 증상 분류</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {symptoms.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setSymptom(item.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${symptom === item.id
                                        ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                        : "border-white/5 bg-[#0A0B10] hover:border-white/10 text-gray-500 hover:text-gray-300"
                                        }`}
                                >
                                    <div>
                                        {item.icon}
                                    </div>
                                    <span className="text-[10px] font-bold">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Step 2: 상세 설명 및 사진 */}
                    <section>
                        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-4">STEP 2. 상세 설명 및 사진</h3>
                        <div className="space-y-3">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="어떤 상황인지 자세히 적어주세요. (예: 인덕션 켤 때마다 주방 차단기가 내려가요)"
                                className="w-full h-32 p-4 bg-[#0A0B10] rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none text-gray-200 placeholder:text-gray-600"
                            />

                            <div className="relative">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                {images.length < 5 && (
                                    <label
                                        htmlFor="image-upload"
                                        className="w-full h-32 border-2 border-dashed border-white/5 bg-white/5 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-white/10 transition-all group mb-3"
                                    >
                                        <Camera className="w-8 h-8 text-gray-600 group-hover:text-blue-400 mb-2 transition-colors" />
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-gray-500 group-hover:text-blue-400 transition-colors">
                                                이곳을 눌러 사진을 등록해주세요 ({images.length}/5)
                                            </p>
                                            <p className="text-[10px] text-gray-600 mt-1">JPEG, PNG 가능 / 장당 10MB 이내</p>
                                        </div>
                                    </label>
                                )}

                                {images.length > 0 && (
                                    <div className="grid grid-cols-5 gap-2">
                                        {images.map((img, i) => (
                                            <div key={i} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden border border-white/10 group">
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    alt="preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    onClick={() => removeImage(i)}
                                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Step 3: 개인 정보 */}
                    <section>
                        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-4">STEP 3. 개인 정보</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="성함"
                                className="w-full p-4 bg-[#0A0B10] rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-gray-200 placeholder:text-gray-600"
                            />
                            <input
                                type="text"
                                value={contact}
                                onChange={handleContactChange}
                                placeholder="연락처"
                                className="w-full p-4 bg-[#0A0B10] rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-gray-200 placeholder:text-gray-600"
                            />
                        </div>
                    </section>
                </div>

                {/* Footer Button */}
                <div className="p-6 border-t border-white/5 sticky bottom-0 bg-[#15161c]">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-4 bg-[#4F46E5] hover:bg-[#4338ca] active:scale-[0.98] text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[#4F46E5]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "접수 중..." : "전문가 무료 진단 받기"}
                    </button>
                </div>
            </div>
        </div>
    );
}
