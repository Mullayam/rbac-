import { USER_STATUS } from "@/utils/helpers/constants";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolesEntity } from "./roles.entity";
import { TenantUsersEntity } from "./tenant_users.entity";

@Entity("modules")
export class ParentAdminUsersEntity {
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
    role!: string

    @OneToMany(type => TenantUsersEntity, tenantUser => tenantUser.parent_admin)
    tenant_users!: TenantUsersEntity[]

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

}