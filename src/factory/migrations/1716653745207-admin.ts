import { MigrationInterface, QueryRunner } from "typeorm";

export class Admin1716653745207 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(``)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
