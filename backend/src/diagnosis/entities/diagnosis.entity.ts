import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Diagnosis {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string; // 신청자 이름

    @Column({ nullable: true })
    contact: string; // 연락처

    @Column("simple-array", { nullable: true })
    imageUrl: string[]; // 업로드된 이미지 경로 (배열)

    @Column({ nullable: true })
    symptoms: string; // 사용자가 선택한 증상

    @Column({ type: 'text', nullable: true })
    description: string; // 상세 설명

    @Column({ type: 'text', nullable: true })
    aiAnalysis: string; // AI 분석 결과

    @Column({ type: 'int', default: 0 })
    riskScore: number; // 0~100 점

    // STATUS: RECEIPT(접수완료) -> WAITING(상담대기) -> ANSWERED(전문가답변) -> VISIT(방문/시공) or REJECTED(거절됨)
    @Column({ default: 'RECEIPT' })
    status: string;

    @Column({ type: 'text', nullable: true })
    expertComment: string; // 전문가 답변

    @Column({ type: 'int', nullable: true })
    estimatedCost: number; // 예상 견적

    @CreateDateColumn()
    createdAt: Date;
}
