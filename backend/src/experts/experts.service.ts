import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpertDto } from './dto/create-expert.dto';
import { UpdateExpertDto } from './dto/update-expert.dto';
import { Expert } from './entities/expert.entity';

@Injectable()
export class ExpertsService implements OnModuleInit {
  constructor(
    @InjectRepository(Expert)
    private expertsRepository: Repository<Expert>,
  ) { }

  async onModuleInit() {
    // 초기 더미 데이터 생성 (DB가 비어있을 경우)
    const count = await this.expertsRepository.count();
    if (count === 0) {
      const seedData = [
        { name: '박준형 마스터', specialty: '누전 수리', region: '성남시 분당구', rating: 4.9, reviewCount: 128, isCertified: true },
        { name: '김철수 기술사', specialty: '배선 교체', region: '성남시 수정구', rating: 5.0, reviewCount: 85, isCertified: true },
        { name: '이영희 기사', specialty: '조명 설치', region: '성남시 중원구', rating: 4.7, reviewCount: 42, isCertified: true },
        { name: '최민수 전문가', specialty: '긴급 출동', region: '판교 전체', rating: 4.8, reviewCount: 210, isCertified: false },
      ];
      await this.expertsRepository.save(seedData);
      console.log('Seeded expert data');
    }
  }

  create(createExpertDto: CreateExpertDto) {
    return this.expertsRepository.save(createExpertDto);
  }

  findAll() {
    return this.expertsRepository.find();
  }

  findOne(id: number) {
    return this.expertsRepository.findOneBy({ id });
  }

  update(id: number, updateExpertDto: UpdateExpertDto) {
    return `This action updates a #${id} expert`;
  }

  remove(id: number) {
    return `This action removes a #${id} expert`;
  }
}
