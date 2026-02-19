import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditModule } from './modules/audit/audit.module';
import { HomesModule } from './modules/homes/homes.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { NotesModule } from './modules/notes/notes.module';
import { VisitsModule } from './modules/visits/visits.module';
import { DevicesModule } from './modules/devices/devices.module';

// Entities
import { User } from './modules/users/user.entity';
import { Home } from './modules/homes/home.entity';
import { HomeMembership } from './modules/homes/home-membership.entity';
import { Resident } from './modules/homes/resident.entity';
import { Device } from './modules/devices/device.entity';
import { SensorEvent } from './modules/events/event.entity';
import { Alert } from './modules/alerts/alert.entity';
import { Note } from './modules/notes/note.entity';
import { VisitReport } from './modules/visits/visit-report.entity';
import { AuditLog } from './modules/audit/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        User, Home, HomeMembership, Resident,
        Device, SensorEvent, Alert, Note, VisitReport, AuditLog,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: process.env.DATABASE_URL?.includes('railway')
        ? { rejectUnauthorized: false }
        : undefined,
      logging: process.env.NODE_ENV !== 'production',
    }),
    AuditModule,
    HomesModule,
    AlertsModule,
    NotesModule,
    VisitsModule,
    DevicesModule,
  ],
})
export class AppModule {}
