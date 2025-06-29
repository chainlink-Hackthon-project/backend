import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedLenderColATERALDetailsInUserTable1750827514047 implements MigrationInterface {
    name = 'AddedLenderColATERALDetailsInUserTable1750827514047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "repayment_status"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "no_of_loan_taken"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "status" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "user_status" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lended_amount" character varying NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "collateral_amount" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "borrowed_amount" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "interest_rate" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "start_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "liquidation_price" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "liquidation_price"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "interest_rate"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "borrowed_amount"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "collateral_amount"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lended_amount"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_status"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "no_of_loan_taken" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "repayment_status" integer NOT NULL`);
    }

}
