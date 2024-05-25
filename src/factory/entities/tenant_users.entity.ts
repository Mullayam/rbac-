import { USER_STATUS } from "@/utils/helpers/constants";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolesEntity } from "./roles.entity";
import { ParentAdminUsersEntity } from "./parent_admin.entity";
import { RacMapEntity } from "./racmap.entity";

@Entity("modules")
export class TenantUsersEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    email!: string

    @Column()
    password!: string

    @Column({ default: USER_STATUS.INACTIVE, enum: USER_STATUS })
    status!: string

    @OneToMany(type => RolesEntity, r => r.user)
    role!: RolesEntity

    @OneToMany(type => RacMapEntity, racmap => racmap.tenant_user)
    racmap!: RacMapEntity[]

    @OneToMany(type => ParentAdminUsersEntity, r => r.tenant_users)
    parent_admin!: ParentAdminUsersEntity[]

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

}