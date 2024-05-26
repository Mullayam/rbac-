import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SubModulesEntity } from "./submodule.entity";
import { RacMapEntity } from "./racmap.entity";

@Entity("modules")
export class ModulesEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    module_name!: string

    @Column()
    description!: string

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @OneToMany(type => SubModulesEntity, module => module.parentModule)
    submodules!: SubModulesEntity[]

    @OneToMany(type => RacMapEntity, racmap => racmap.modules)
    racmap!: RacMapEntity[]

}