import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ModulesEntity } from "./module.entity";
import { RacMapEntity } from "./racmap.entity";

@Entity("submodules")
export class SubModulesEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    submodule_name!: string

    @Column()
    description!: string

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @ManyToOne(type => ModulesEntity, module => module.submodules)
    parentModule!: string

    @OneToMany(type => RacMapEntity, racmap => racmap.submodules)
    racmap!: RacMapEntity[]
}