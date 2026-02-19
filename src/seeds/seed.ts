import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../modules/users/user.entity';
import { Home, PlanTier, HomeStatus } from '../modules/homes/home.entity';
import { HomeMembership, HomeMemberRole } from '../modules/homes/home-membership.entity';
import { Resident } from '../modules/homes/resident.entity';
import { Device, DeviceType, DeviceStatus } from '../modules/devices/device.entity';
import { Alert, AlertSeverity, AlertStatus } from '../modules/alerts/alert.entity';
import { Note, NoteCategory, NoteVisibility } from '../modules/notes/note.entity';
import { VisitReport, VisitType } from '../modules/visits/visit-report.entity';
import { AuditLog } from '../modules/audit/audit-log.entity';
import { SensorEvent } from '../modules/events/event.entity';

const ds = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Home, HomeMembership, Resident, Device, SensorEvent, Alert, Note, VisitReport, AuditLog],
  synchronize: true,
  ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : undefined,
});

async function seed() {
  await ds.initialize();
  console.log('Connected to database');

  const orgId = uuid();

  // Users
  const joseId = uuid();
  const sarahId = uuid();
  const passwordHash = await bcrypt.hash('rockwell2026', 10);

  await ds.getRepository(User).save([
    { id: joseId, orgId, email: 'jose@rockwellhm.com', phone: '7152550235', firstName: 'Jose', lastName: 'Lagunas', passwordHash, role: UserRole.ORG_ADMIN },
    { id: sarahId, orgId, email: 'sarah.j@email.com', phone: '7155550142', firstName: 'Sarah', lastName: 'Johnson', passwordHash, role: UserRole.FAMILY_ADMIN },
  ]);

  // Homes
  const lakeviewId = uuid();
  const hartfieldId = uuid();
  const ridgeviewId = uuid();
  const pineId = uuid();

  await ds.getRepository(Home).save([
    { id: lakeviewId, orgId, name: 'Lakeview Residence', address: '412 Bridgewater Ave', city: 'Chippewa Falls', zip: '54729', planTier: PlanTier.ESTATE, status: HomeStatus.ACTIVE, accessNotes: { lockbox: '4782', garageKeypad: '7291', entry: 'Side entry' }, vendorContacts: { plumbing: "Dave's Plumbing (715) 555-0198", hvac: 'Valley HVAC (715) 555-0234' } },
    { id: hartfieldId, orgId, name: 'Hartfield Estate', address: '1890 County Rd K', city: 'Eau Claire', zip: '54701', planTier: PlanTier.PREMIER, status: HomeStatus.ACTIVE },
    { id: ridgeviewId, orgId, name: 'Ridgeview Home', address: '567 Oak Lane', city: 'Chippewa Falls', zip: '54729', planTier: PlanTier.PREMIER, status: HomeStatus.ACTIVE },
    { id: pineId, orgId, name: 'Pine Street Cottage', address: '234 Pine St', city: 'Eau Claire', zip: '54703', planTier: PlanTier.ESSENTIAL, status: HomeStatus.ACTIVE },
  ]);

  // Memberships
  await ds.getRepository(HomeMembership).save([
    { userId: joseId, homeId: lakeviewId, role: HomeMemberRole.STAFF },
    { userId: joseId, homeId: hartfieldId, role: HomeMemberRole.STAFF },
    { userId: joseId, homeId: ridgeviewId, role: HomeMemberRole.STAFF },
    { userId: joseId, homeId: pineId, role: HomeMemberRole.STAFF },
    { userId: sarahId, homeId: lakeviewId, role: HomeMemberRole.FAMILY_ADMIN },
  ]);

  // Residents
  await ds.getRepository(Resident).save([
    { homeId: lakeviewId, firstName: 'Margaret', lastName: 'Williams', emergencyContacts: [{ name: 'Sarah Johnson', relationship: 'Daughter', phone: '(715) 555-0142', isPrimary: true }] },
    { homeId: hartfieldId, firstName: 'Robert', lastName: 'Hartfield' },
    { homeId: ridgeviewId, firstName: 'Dorothy', lastName: 'Mitchell' },
    { homeId: pineId, firstName: 'James', lastName: 'Thompson' },
  ]);

  // Devices for Lakeview
  await ds.getRepository(Device).save([
    { homeId: lakeviewId, name: 'Front Door Sensor', location: 'Main Entry', type: DeviceType.CONTACT, battery: 92, status: DeviceStatus.ONLINE, lastSeen: new Date() },
    { homeId: lakeviewId, name: 'Garage Entry Sensor', location: 'Garage', type: DeviceType.CONTACT, battery: 87, status: DeviceStatus.ONLINE, lastSeen: new Date() },
    { homeId: lakeviewId, name: 'Living Room Climate', location: 'Main Floor', type: DeviceType.CLIMATE, battery: 95, status: DeviceStatus.ONLINE, lastSeen: new Date() },
    { homeId: lakeviewId, name: 'Basement Leak Detector', location: 'Basement', type: DeviceType.LEAK, battery: 78, status: DeviceStatus.ONLINE, lastSeen: new Date() },
    { homeId: lakeviewId, name: 'Kitchen Motion', location: 'Kitchen', type: DeviceType.MOTION, battery: 85, status: DeviceStatus.ONLINE, lastSeen: new Date() },
    { homeId: lakeviewId, name: 'Smart Pillbox', location: 'Kitchen Counter', type: DeviceType.PILLBOX, battery: 90, status: DeviceStatus.ONLINE, lastSeen: new Date() },
  ]);

  // Device for Hartfield with low battery
  await ds.getRepository(Device).save([
    { homeId: hartfieldId, name: 'Basement Leak Detector', location: 'Basement', type: DeviceType.LEAK, battery: 28, status: DeviceStatus.LOW_BATTERY, lastSeen: new Date() },
  ]);

  // Notes
  await ds.getRepository(Note).save([
    { homeId: lakeviewId, authorId: joseId, authorName: 'Jose L.', category: NoteCategory.MAINTENANCE, visibility: NoteVisibility.STAFF_ONLY, body: 'Kitchen faucet dripping intermittently. Scheduled Dave\'s Plumbing for Feb 22. Margaret aware.' },
    { homeId: lakeviewId, authorId: joseId, authorName: 'Jose L.', category: NoteCategory.GENERAL, visibility: NoteVisibility.STAFF_FAMILY_ADMIN, body: 'Routine check complete. Walkways salted, furnace filter checked. Margaret in good spirits.' },
    { homeId: lakeviewId, authorId: joseId, authorName: 'Jose L.', category: NoteCategory.VENDOR, visibility: NoteVisibility.STAFF_ONLY, body: 'Water heater inspection by Dave\'s Plumbing — good condition. Recommend flush Spring 2026.' },
  ]);

  // Visit Reports
  await ds.getRepository(VisitReport).save([
    { homeId: lakeviewId, staffId: joseId, staffName: 'Jose L.', visitType: VisitType.ROUTINE, checklist: [
      { item: 'Entry points', checked: true }, { item: 'Furnace filter', checked: true },
      { item: 'Walkways salted', checked: true }, { item: 'Smoke detectors', checked: true },
    ], summary: 'All clear. Walkways salted, furnace filter good through March.', durationMinutes: 45, visitDate: new Date('2026-02-13T10:00:00') },
  ]);

  console.log('✅ Seed data inserted successfully');
  await ds.destroy();
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
