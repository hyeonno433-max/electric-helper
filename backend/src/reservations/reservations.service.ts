import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ConfirmReservationDto } from './dto/confirm-reservation.dto';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { Diagnosis } from '../diagnosis/entities/diagnosis.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(Diagnosis)
    private diagnosisRepository: Repository<Diagnosis>,
  ) { }

  async create(createReservationDto: CreateReservationDto) {
    // 1. 예약 생성
    const reservation = this.reservationsRepository.create({
      ...createReservationDto,
      status: ReservationStatus.PENDING,
    });

    const savedReservation = await this.reservationsRepository.save(reservation);

    // 2. 연관된 진단 내역이 있다면 상태를 변경 (VISIT: 방문요청됨/방문예정)
    if (createReservationDto.diagnosisId) {
      const diagnosis = await this.diagnosisRepository.findOneBy({ id: createReservationDto.diagnosisId });
      if (diagnosis) {
        // 예약이 접수되면 진단 상태를 'VISIT' (방문요청됨) 상태로 업데이트
        // Entity 정의에 VISIT은 없지만, 주석에 있으므로 string 값으로 사용
        diagnosis.status = 'VISIT';
        await this.diagnosisRepository.save(diagnosis);
      }
    }

    return savedReservation;
  }

  async confirm(id: number, confirmReservationDto: ConfirmReservationDto) {
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation #${id} not found`);
    }

    reservation.status = ReservationStatus.CONFIRMED;
    reservation.estimatedCost = confirmReservationDto.estimatedCost;
    reservation.expertNote = confirmReservationDto.expertNote;
    reservation.confirmedDate = confirmReservationDto.confirmedDate;

    return this.reservationsRepository.save(reservation);
  }

  findAll() {
    return this.reservationsRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  findOne(id: number) {
    return this.reservationsRepository.findOneBy({ id });
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  async cancel(id: number) {
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation #${id} not found`);
    }

    reservation.status = ReservationStatus.CANCELED;
    await this.reservationsRepository.save(reservation);

    // 연관된 진단 상태도 업데이트 (방문 거절됨 -> REJECTED로 표시하거나 별도 상태 추가)
    // 여기서는 REJECTED를 '방문 거절/취소' 의미로 사용
    if (reservation.diagnosisId) {
      const diagnosis = await this.diagnosisRepository.findOneBy({ id: reservation.diagnosisId });
      if (diagnosis) {
        diagnosis.status = 'REJECTED';
        await this.diagnosisRepository.save(diagnosis);
      }
    }

    return reservation;
  }

  // 실제 삭제 대신 취소 처리를 권장하지만, MVP에서는 삭제도 일단 둠
  remove(id: number) {
    return this.reservationsRepository.delete(id);
  }
}
