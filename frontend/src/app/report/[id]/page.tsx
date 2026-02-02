import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ReportPage({ params }: { params: { id: string } }) {
    // Mock Data for the report
    const reportData = {
        id: params.id,
        date: new Date().toLocaleDateString(),
        location: "경기도 성남시 분당구 판교역로",
        score: 45,
        riskLevel: "DANGER (위험)",
        summary: "콘센트 접촉 불량 및 내부 열화 현상 감지됨",
        details: [
            { category: "Visual Inspection", status: "Fail", note: "플러그 주변 그을림 확인" },
            { category: "Thermal Analysis", status: "Warning", note: "주변 온도 상승 감지 (추정)" },
            { category: "Wiring Condition", status: "Critical", note: "피복 손상 의심" },
        ],
        recommendation: "즉시 전원 차단 후 전문가 점검 요망",
    };

    return (
        <main className="flex min-h-screen flex-col items-center py-12 px-4 bg-deep-navy text-foreground">
            <div className="w-full max-w-3xl bg-white text-black p-8 md:p-16 rounded-xl shadow-2xl relative overflow-hidden">
                {/* Watermark effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-100 text-9xl font-black -rotate-45 pointer-events-none select-none z-0">
                    CONFIDENTIAL
                </div>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold uppercase tracking-wider">Electric Safety</h1>
                            <h2 className="text-xl font-bold text-gray-600">Forensic Report</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold">Report ID: {reportData.id}</p>
                            <p className="text-sm text-gray-500">{reportData.date}</p>
                        </div>
                    </div>

                    {/* Score Section */}
                    <div className="flex justify-between items-center bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                        <div>
                            <p className="text-sm uppercase font-bold text-gray-500 mb-1">Safety Score</p>
                            <div className="text-5xl font-black text-red-600 tracking-tighter">
                                {reportData.score}<span className="text-2xl text-gray-400 font-medium">/100</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm uppercase font-bold text-gray-500 mb-1">Risk Level</p>
                            <div className="text-2xl font-bold text-red-600 border-2 border-red-600 px-4 py-1 inline-block rounded">
                                {reportData.riskLevel}
                            </div>
                        </div>
                    </div>

                    {/* Details Table */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold border-l-4 border-deep-navy pl-3 mb-4 uppercase">Inspection Details</h3>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-300">
                                    <th className="py-2 text-sm font-bold text-gray-600 uppercase">Category</th>
                                    <th className="py-2 text-sm font-bold text-gray-600 uppercase">Status</th>
                                    <th className="py-2 text-sm font-bold text-gray-600 uppercase">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.details.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="py-3 font-medium">{item.category}</td>
                                        <td className={`py-3 font-bold ${item.status === 'Fail' || item.status === 'Critical' ? 'text-red-600' : 'text-orange-500'
                                            }`}>
                                            {item.status}
                                        </td>
                                        <td className="py-3 text-gray-600 text-sm">{item.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Conclusion */}
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-12">
                        <h4 className="font-bold text-red-700 mb-1">AI Diagnosis Conclusion</h4>
                        <p className="text-red-900 font-medium">{reportData.recommendation}</p>
                    </div>

                    {/* Footer / Actions */}
                    <div className="flex flex-col md:flex-row gap-4 justify-center print:hidden">
                        <Button className="flex-1 bg-deep-navy text-white hover:bg-gray-800" size="lg">
                            📄 Download PDF
                        </Button>
                        <Link href="/experts" className="flex-1">
                            <Button className="w-full bg-neon-green text-deep-navy font-bold hover:opacity-90" size="lg">
                                👨‍🔧 Find Experts Now
                            </Button>
                        </Link>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-8 print:block hidden">
                        Generated by Electric Helper AI on {new Date().toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link href="/" className="text-gray-500 hover:text-white underline text-sm">
                    Back to Home
                </Link>
            </div>
        </main>
    );
}
