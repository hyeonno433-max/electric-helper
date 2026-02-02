"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "자가 조치와 전문가 방문 수리의 차이는 무엇인가요?",
        answer: "자가 조치는 간단한 점검이나 소모품 교체를 의미하며, 전문가 방문 수리는 전문 장비를 사용하여 원인을 진단하고 안전하게 문제를 해결하는 서비스입니다. 전기 문제는 안전과 직결되므로 전문가의 진단을 권장합니다."
    },
    {
        question: "견적 산출 방식이 궁금합니다.",
        answer: "견적은 기본적인 출장비와 진단비가 포함되며, 수리에 필요한 부품비와 작업 난이도에 따라 추가 비용이 발생할 수 있습니다. 진단 후 정확한 견적을 안내해 드립니다."
    },
    {
        question: "성남 외 다른 지역도 서비스가 가능한가요?",
        answer: "현재는 성남 지역을 중심으로 서비스를 제공하고 있으며, 점차 서비스 지역을 확대해 나갈 예정입니다. 인근 지역의 경우 고객센터로 문의해 주시기 바랍니다."
    },
    {
        question: "야간 긴급 수리 비용은 얼마인가요?",
        answer: "야간 긴급 수리는 기본 출장비에 야간 할증이 적용됩니다. 정확한 비용은 시간대와 상황에 따라 다르므로 앱 내 접수 시 예상 비용을 확인하실 수 있습니다."
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="w-full max-w-4xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold italic mb-2">자주 묻는 질문</h2>
                <p className="text-gray-400">궁금한 점이 있다면 언제 확인해보세요.</p>
            </div>

            <div className="space-y-4">
                {faqs.map((item, i) => (
                    <div
                        key={i}
                        className={`group p-5 bg-[#111218] border border-white/5 rounded-xl cursor-pointer hover:bg-white/5 transition-all duration-300 ${openIndex === i ? 'border-indigo-500/30 bg-white/5' : ''}`}
                        onClick={() => toggleFAQ(i)}
                    >
                        <div className="flex justify-between items-center">
                            <span className={`font-medium transition-colors ${openIndex === i ? 'text-indigo-400' : 'text-gray-300 group-hover:text-white'}`}>
                                {item.question}
                            </span>
                            {openIndex === i ? (
                                <ChevronDown className="w-5 h-5 text-indigo-400 transition-colors" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                            )}
                        </div>

                        <div
                            className={`grid transition-[grid-template-rows] duration-300 ease-out ${openIndex === i ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
                        >
                            <div className="overflow-hidden">
                                <p className="text-gray-400 text-sm leading-relaxed pl-1 border-l-2 border-indigo-500/30 ml-1 py-1">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
