import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password?: string; // 소셜 로그인 등을 고려하여 optional? 일단 필수처리하거나 null 허용

    @Column()
    name: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ default: 'user' }) // 'user' | 'expert' | 'admin'
    role: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
