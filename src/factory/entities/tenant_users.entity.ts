import { USER_STATUS } from "@/utils/helpers/constants";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolesEntity } from "./roles.entity";
import { ParentAdminUsersEntity } from "./parent_admin.entity";
import { RacMapEntity } from "./racmap.entity";
import { SessionsEntity } from "./session.entity";

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

    @OneToMany(type => RolesEntity, r => r.user, { nullable: true })
    role!: RolesEntity[]

    @OneToMany(type => RacMapEntity, racmap => racmap.tenant_user, { nullable: true })
    racmap!: RacMapEntity[]

    @OneToMany(type => ParentAdminUsersEntity, r => r.tenant_users,)
    parent_admin!: ParentAdminUsersEntity[]

    @OneToMany(type => SessionsEntity, r => r.tenant_user)
    login_session!: SessionsEntity[]

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

}