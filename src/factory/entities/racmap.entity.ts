import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SubModulesEntity } from "./submodule.entity";
import { ModulesEntity } from "./module.entity";
import { PrivilegesEntity } from "./privileges.entity";
import { TenantUsersEntity } from "./tenant_users.entity";

@Entity("racmaps")
export class RacMapEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(type => TenantUsersEntity, role => role.racmap)
    tenant_user!: TenantUsersEntity

    @ManyToOne(type => ModulesEntity, module => module.racmap)
    modules!: ModulesEntity

    @ManyToOne(type => SubModulesEntity, submodule => submodule.parentModule)
    submodules!: SubModulesEntity

    @ManyToOne(type => PrivilegesEntity, pvg => pvg.racmap)
    privilege!: PrivilegesEntity

    @Column()
    description!: string

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

}