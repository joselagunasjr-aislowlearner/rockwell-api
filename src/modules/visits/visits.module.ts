import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitReport } from './visit-report.entity';
import { VisitsService, VisitsController } from './visits.service';

@Module({
  imports: [TypeOrmModule.forFeature([VisitReport])],
  providers: [VisitsService],
  controllers: [VisitsController],
  exports: [VisitsService],
})
export class VisitsModule {}
