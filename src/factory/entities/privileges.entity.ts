import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RacMapEntity } from "./racmap.entity";

@Entity("privileges")
export class PrivilegesEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    privilege_name!: string

    @Column({nullable: true})
    description!: string

    @CreateDateColumn({default: () => "CURRENT_TIMESTAMP"})
    created_at!: Date

    @UpdateDateColumn({default: () => "CURRENT_TIMESTAMP"})
    updated_at!: Date

    @OneToMany(type => RacMapEntity, racmap => racmap.privilege)
    racmap!: RacMapEntity[]
 }