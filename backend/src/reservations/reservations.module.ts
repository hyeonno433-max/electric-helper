import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { Diagnosis } from '../diagnosis/entities/diagnosis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Diagnosis])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule { }
