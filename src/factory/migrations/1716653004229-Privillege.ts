import { MigrationInterface, QueryRunner } from "typeorm"
const combinations: { privilege_name: string, description: string }[] = [
    { privilege_name: "c", description: "Combination of 'c'" },
    { privilege_name: "r", description: "Combination of 'r'" },
    { privilege_name: "u", description: "Combination of 'u'" },
    { privilege_name: "d", description: "Combination of 'd'" },
    { privilege_name: "cr", description: "Combination of 'c' and 'r'" },
    { privilege_name: "cu", description: "Combination of 'c' and 'u'" },
    { privilege_name: "cd", description: "Combination of 'c' and 'd'" },
    { privilege_name: "ru", description: "Combination of 'r' and 'u'" },
    { privilege_name: "rd", description: "Combination of 'r' and 'd'" },
    { privilege_name: "ud", description: "Combination of 'u' and 'd'" },
    { privilege_name: "cru", description: "Combination of 'c', 'r', and 'u'" },
    { privilege_name: "crd", description: "Combination of 'c', 'r', and 'd'" },
    { privilege_name: "cud", description: "Combination of 'c', 'u', and 'd'" },
    { privilege_name: "rud", description: "Combination of 'r', 'u', and 'd'" },
    { privilege_name: "crud", description: "Combination of 'c', 'r', 'u', and 'd'" }
];

const v = combinations.map((combo) => {
    const values = `('${combo.privilege_name}')`
    return values
})
export class Privillege1716653004229 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Table: public.privileges

            -- DROP TABLE IF EXISTS public.privileges;

            CREATE TABLE IF NOT EXISTS public.privileges
            (
            id integer NOT NULL DEFAULT nextval('privileges_id_seq'::regclass),
            privilege_name character varying COLLATE pg_catalog."default" NOT NULL,
            description character varying COLLATE pg_catalog."default",
            created_at timestamp without time zone NOT NULL DEFAULT now(),
            updated_at timestamp without time zone NOT NULL DEFAULT now(),
            CONSTRAINT "PK_13f3ff98ae4d5565ec5ed6036cd" PRIMARY KEY (id)
            )

            TABLESPACE pg_default;

            ALTER TABLE IF EXISTS public.privileges
                OWNER to postgres;
        `)

        await queryRunner.query(`INSERT INTO privileges (privilege_name) VALUES ${v.join(",")}`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
