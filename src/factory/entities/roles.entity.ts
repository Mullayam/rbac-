import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RacMapEntity } from "./racmap.entity";
import { TenantUsersEntity } from "./tenant_users.entity";

@Entity("roles")
export class RolesEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    role_name!: string

    @Column()
    description!: string

    @Column()
    status!: string

    @Column()
    createdBy!: number

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date   

    @OneToMany(type => TenantUsersEntity, racmap => racmap.role)
    user!: TenantUsersEntity[]
}