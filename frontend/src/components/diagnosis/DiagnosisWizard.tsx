import React, { useState } from "react";
import Step1Camera from "./Step1Camera";
import Step2Symptom from "./Step2Symptom";
import Step3Result from "./Step3Result";

const DiagnosisWizard: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<any>(null);
    const [diagnosisData, setDiagnosisData] = useState<{
        image: File | null;
        symptom: string | null;
    }>({
        image: null,
        symptom: null,
    });

    const handleStep1Next = (image: File | null) => {
        setDiagnosisData((prev) => ({ ...prev, image }));
        setStep(2);
    };

    const handleStep2Next = async (symptom: string) => {
        setDiagnosisData((prev) => ({ ...prev, symptom }));
        setStep(3);
        setIsLoading(true);

        try {
            // 실제 API 호출
            const response = await fetch("http://localhost:8000/diagnosis", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageUrl: "uploaded_image.jpg", // 실제 업로드 구현 전이므로 더미 이름 전송
                    symptoms: symptom,
                }),
            });

            if (!response.ok) {
                throw new Error("Diagnosis failed");
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Diagnosis Error:", error);
            // 에러 처리 로직 (필요 시)
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setStep((prev) => Math.max(1, prev - 1));
    };

    const handleReset = () => {
        setStep(1);
        setDiagnosisData({ image: null, symptom: null });
        setResult(null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            {/* Progress Indicator */}
            <div className="mb-8 flex justify-center items-center gap-4">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s
                                ? "bg-neon-green text-deep-navy shadow-[0_0_10px_rgba(57,255,20,0.4)]"
                                : "bg-gray-800 text-gray-500"
                                }`}
                        >
                            {s}
                        </div>
                        {s < 3 && <div className={`w-12 h-1 rounded-full ${step > s ? "bg-neon-green" : "bg-gray-800"}`} />}
                    </div>
                ))}
            </div>

            <div className="min-h-[400px]">
                {step === 1 && <Step1Camera onNext={handleStep1Next} />}
                {step === 2 && (
                    <Step2Symptom
                        onNext={handleStep2Next}
                        onBack={handleBack}
                    />
                )}
                {step === 3 && (
                    <Step3Result
                        loading={isLoading}
                        result={result}
                        onReset={handleReset}
                    />
                )}
            </div>
        </div>
    );
};

export default DiagnosisWizard;
