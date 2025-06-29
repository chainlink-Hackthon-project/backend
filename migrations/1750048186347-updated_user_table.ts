import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedUserTable1750048186347 implements MigrationInterface {
    name = 'UpdatedUserTable1750048186347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "account_address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "repayment_status" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "no_of_loan_taken" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "no_of_loan_taken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "repayment_status"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "account_address"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailId" character varying NOT NULL`);
    }

}
