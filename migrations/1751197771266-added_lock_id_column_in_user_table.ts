import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedLockIdColumnInUserTable1751197771266 implements MigrationInterface {
    name = 'AddedLockIdColumnInUserTable1751197771266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "loan_lock_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "loan_lock_id"`);
    }

}
