import { Tasks } from "src/tasks/task.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
export enum UserRole{
  USER='user',
  ADMIN = 'admin'
}
@Entity('users')
export class User{
  @PrimaryGeneratedColumn('uuid')
  id:string

  @Column()
  name:string

  @Column({unique:true})
  email:string

  @Column({
    type:'enum',
    enum:UserRole,
    default:UserRole.USER
  })
  role:UserRole

  @CreateDateColumn()
  createdAt :Date

  @UpdateDateColumn()
  updatedAt:Date

  @ManyToMany(() => Tasks, (task) => task.assignedUsers)
  tasks ?: Tasks[];
}