import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClientsTable1740700800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone VARCHAR NOT NULL UNIQUE,
        "firstName" VARCHAR,
        "lastName" VARCHAR,
        email VARCHAR,
        role VARCHAR NOT NULL DEFAULT 'client',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Set Jose to admin if his record exists (he must register via OTP first)
    await queryRunner.query(`
      UPDATE clients SET role = 'admin'
      WHERE phone = '+16087729960' AND role != 'admin';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS clients;`);
  }
}
