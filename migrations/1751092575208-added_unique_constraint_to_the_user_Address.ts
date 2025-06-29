import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUniqueConstraintToTheUserAddress1751092575208 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_user_account_address" UNIQUE ("account_address");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            DROP CONSTRAINT "UQ_user_account_address";
        `);
    }

}
