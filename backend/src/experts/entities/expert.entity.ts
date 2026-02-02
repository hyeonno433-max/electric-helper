import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Expert {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    specialty: string;

    @Column()
    region: string; // 활동 지역

    @Column({ type: 'decimal', precision: 2, scale: 1, default: 0.0 })
    rating: number; // 5.0 만점

    @Column({ default: 0 })
    reviewCount: number;

    @Column({ default: false })
    isCertified: boolean; // 국가 공인 자격증 유무

    @Column({ nullable: true })
    imageUrl: string;

    @CreateDateColumn()
    createdAt: Date;
}
