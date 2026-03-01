import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessagesTable1741000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "clientId" UUID NOT NULL REFERENCES clients(id),
        direction VARCHAR NOT NULL,
        body TEXT NOT NULL,
        "twilioSid" VARCHAR,
        status VARCHAR NOT NULL DEFAULT 'sent',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS messages;`);
  }
}
