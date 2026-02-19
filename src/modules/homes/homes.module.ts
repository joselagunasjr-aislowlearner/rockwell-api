import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from './home.entity';
import { HomeMembership } from './home-membership.entity';
import { Resident } from './resident.entity';
import { HomesService } from './homes.service';
import { HomesController } from './homes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Home, HomeMembership, Resident])],
  providers: [HomesService],
  controllers: [HomesController],
  exports: [HomesService],
})
export class HomesModule {}
