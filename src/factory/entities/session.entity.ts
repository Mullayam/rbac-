import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TenantUsersEntity } from "./tenant_users.entity";

@Entity("sessions")
export class SessionsEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    session_name!: string

    @Column()
    rpid!: string

    @Column()
    challenge!: string

    @Column()
    expected_origin!: string

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @ManyToOne(type => TenantUsersEntity, tuser => tuser.login_session)
    tenant_user!: TenantUsersEntity


}