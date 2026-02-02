import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import React, { useState } from "react";

interface Step2SymptomProps {
    onNext: (symptom: string) => void;
    onBack: () => void;
}

const symptoms = [
    { id: "burn", label: "탄 자국/그을림", icon: "🔥" },
    { id: "spark", label: "스파크/불꽃 튀김", icon: "⚡" },
    { id: "smell", label: "타는 냄새/악취", icon: "👃" },
    { id: "cut", label: "피복 벗겨짐/손상", icon: "✂️" },
    { id: "water", label: "물기/습기 노출", icon: "💧" },
    { id: "other", label: "기타/잘 모름", icon: "❓" },
];

const Step2Symptom: React.FC<Step2SymptomProps> = ({ onNext, onBack }) => {
    const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

    return (
        <Card className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
                <CardTitle>증상 선택</CardTitle>
                <CardDescription>
                    현재 관찰되는 가장 눈에 띄는 증상을 선택해주세요.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                    {symptoms.map((symptom) => (
                        <button
                            key={symptom.id}
                            onClick={() => setSelectedSymptom(symptom.id)}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedSymptom === symptom.id
                                    ? "border-neon-green bg-neon-green/10 text-neon-green shadow-[0_0_10px_rgba(57,255,20,0.2)]"
                                    : "border-gray-800 bg-gray-900/50 text-gray-400 hover:bg-gray-800"
                                }`}
                        >
                            <span className="text-2xl">{symptom.icon}</span>
                            <span className="font-medium text-sm">{symptom.label}</span>
                        </button>
                    ))}
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onBack}>
                        이전
                    </Button>
                    <Button
                        className="flex-[2]"
                        disabled={!selectedSymptom}
                        onClick={() => selectedSymptom && onNext(selectedSymptom)}
                    >
                        다음: 진단 결과 확인
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Step2Symptom;
