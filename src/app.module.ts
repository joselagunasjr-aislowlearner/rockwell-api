import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditModule } from './modules/audit/audit.module';
import { HomesModule } from './modules/homes/homes.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { NotesModule } from './modules/notes/notes.module';
import { VisitsModule } from './modules/visits/visits.module';
import { DevicesModule } from './modules/devices/devices.module';
import { LeadsModule } from './modules/leads/leads.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { TwilioModule } from './modules/twilio/twilio.module';
import { MessagesModule } from './modules/messages/messages.module';

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
import { Lead } from './modules/leads/lead.entity';
import { Client } from './modules/clients/entities/client.entity';
import { Message } from './modules/messages/entities/message.entity';
import { CreateClientsTable1740700800000 } from './migrations/1740700800000-CreateClientsTable';
import { CreateMessagesTable1741000000000 } from './migrations/1741000000000-CreateMessagesTable';

console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        User, Home, HomeMembership, Resident,
        Device, SensorEvent, Alert, Note, VisitReport, AuditLog, Lead,
        Client,
        Message,
      ],
      migrations: [CreateClientsTable1740700800000, CreateMessagesTable1741000000000],
      migrationsRun: true,
      synchronize: false,
      ssl: false,
      logging: true,
      retryAttempts: 3,
      retryDelay: 3000,
    }),
    AuditModule,
    HomesModule,
    AlertsModule,
    NotesModule,
    VisitsModule,
    DevicesModule,
    LeadsModule,
    TwilioModule,
    AuthModule,
    MessagesModule,
    ClientsModule,
  ],
})
export class AppModule {}
