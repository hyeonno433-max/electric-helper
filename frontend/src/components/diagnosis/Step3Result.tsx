import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface DiagnosisResult {
    id: number;
    riskScore: number;
    aiAnalysis: string;
    status: string;
}

interface Step3ResultProps {
    onReset: () => void;
    loading: boolean;
    result: DiagnosisResult | null;
}

const Step3Result: React.FC<Step3ResultProps> = ({ onReset, loading, result }) => {

    if (loading) {
        return (
            <Card className="w-full max-w-md mx-auto border-indigo-500/30">
                <CardContent className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">AI가 분석 중입니다...</h3>
                    <p className="text-gray-400 text-center">이미지의 위험 요소와 증상을<br />정밀하게 파악하고 있습니다.</p>
                </CardContent>
            </Card>
        );
    }

    if (!result) return null;

    const isDanger = result.riskScore <= 60; // 60점 이하면 위험

    return (
        <Card className={`w-full max-w-md mx-auto animate-in fade-in zoom-in duration-500 ${isDanger ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-green-500/50 shadow-[0_0_30px_rgba(57,255,20,0.2)]'}`}>
            <CardHeader className="text-center">
                <div className={`mx-auto p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 border text-4xl animate-pulse ${isDanger ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                    {isDanger ? '🚨' : '✅'}
                </div>
                <CardTitle className={`text-2xl ${isDanger ? 'text-red-500' : 'text-neon-green'}`}>
                    진단 결과: {isDanger ? '위험 (Danger)' : '안전 (Safe)'}
                </CardTitle>
                <CardDescription className="text-gray-300 mt-2">
                    안전 점수: <span className={`font-bold text-lg ${isDanger ? 'text-red-400' : 'text-neon-green'}`}>{result.riskScore}점</span> / 100점
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-gray-900/80 p-5 rounded-lg border border-gray-800">
                    <h4 className="font-bold text-gray-200 mb-2">AI 분석 요약</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {result.aiAnalysis}
                    </p>
                </div>

                <Link href={result.id ? `/experts?diagnosisId=${result.id}` : "/experts"}>
                    <Button className={`w-full text-white shadow-lg ${isDanger ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/20'}`} size="lg">
                        {isDanger ? '📞 최우수 전문가 즉시 호출' : '👨‍🔧 전문가 점검 예약하기'}
                    </Button>
                </Link>
                <Button variant="ghost" className="w-full" onClick={onReset}>
                    처음으로 돌아가기
                </Button>
            </CardContent>
        </Card>
    );
};

export default Step3Result;
