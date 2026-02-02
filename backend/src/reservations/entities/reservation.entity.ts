import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum ReservationStatus {
    PENDING = 'PENDING',
    QUOTE_SENT = 'QUOTE_SENT', // 견적 발송됨
    CONFIRMED = 'CONFIRMED',
    CANCELED = 'CANCELED',
}

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    expertId: number; // 전문가 ID

    @Column({ nullable: true })
    userId: number; // 사용자 ID (로그인 기능 연동 전이므로 nullable)

    @Column()
    reservationDate: string; // 희망 예약 날짜/시간 (문자열로 간소화)

    @Column()
    description: string; // 증상 설명 또는 요청 사항

    @Column({ nullable: true })
    diagnosisId: number; // 연관된 진단 ID


    @Column({
        type: 'text', // enum support in sqlite/postgres varies, text is safest for simple MVP
        default: ReservationStatus.PENDING
    })
    status: string;

    @Column({ nullable: true })
    confirmedDate: string; // 전문가가 확정한 방문 날짜/시간

    @Column({ nullable: true })
    estimatedCost: number; // 전문가가 제시한 견적 금액

    @Column({ type: 'text', nullable: true })
    expertNote: string; // 전문가 코멘트

    @CreateDateColumn()
    createdAt: Date;
}
