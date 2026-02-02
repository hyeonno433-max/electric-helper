import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { Diagnosis } from './entities/diagnosis.entity';

@Injectable()
export class DiagnosisService {
  constructor(
    @InjectRepository(Diagnosis)
    private diagnosisRepository: Repository<Diagnosis>,
  ) { }

  async create(createDiagnosisDto: CreateDiagnosisDto) {
    // 1. 엔티티 생성
    const diagnosis = this.diagnosisRepository.create({
      ...createDiagnosisDto,
      status: 'RECEIPT', // 접수 완료 상태로 시작
    });

    // DB 저장 (ID 생성)
    await this.diagnosisRepository.save(diagnosis);

    // 2. AI 분석 시뮬레이션 (Mock)
    const mockAnalysis = this.simulateAIAnalysis();

    diagnosis.aiAnalysis = mockAnalysis.summary;
    diagnosis.riskScore = mockAnalysis.score;
    // AI 분석이 끝나도 상태는 여전히 RECEIPT (전문가 할당 전) 또는 WAITING(상담대기)으로 변경 가능
    // 여기서는 바로 상담 대기 상태로 넘김
    diagnosis.status = 'WAITING';

    return this.diagnosisRepository.save(diagnosis);
  }

  async addResponse(id: number, expertComment: string, estimatedCost: number) {
    const diagnosis = await this.diagnosisRepository.findOneBy({ id });
    if (!diagnosis) {
      throw new Error('Diagnosis not found');
    }

    diagnosis.expertComment = expertComment;
    diagnosis.estimatedCost = estimatedCost;
    diagnosis.status = 'ANSWERED'; // 전문가 답변 완료 상태

    return this.diagnosisRepository.save(diagnosis);
  }

  async updateStatus(id: number, status: string) {
    const diagnosis = await this.diagnosisRepository.findOneBy({ id });
    if (!diagnosis) {
      throw new Error('Diagnosis not found');
    }
    diagnosis.status = status;
    return this.diagnosisRepository.save(diagnosis);
  }

  findAll() {
    return this.diagnosisRepository.find();
  }

  findOne(id: number) {
    return this.diagnosisRepository.findOneBy({ id });
  }

  update(id: number, updateDiagnosisDto: UpdateDiagnosisDto) {
    return `This action updates a #${id} diagnosis`;
  }

  remove(id: number) {
    return `This action removes a #${id} diagnosis`;
  }

  private simulateAIAnalysis() {
    return {
      score: Math.floor(Math.random() * 30) + 70, // 70~99점 랜덤
      summary: "AI 분석 결과: 콘센트 주변에서 미세한 열화 흔적이 감지되었습니다. 배선 교체를 권장합니다.",
    };
  }
}
