import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
export enum TaskStatus{
  ASSIGNED='assigned',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
  OPEN = 'open'
}

@Entity()
export class Tasks {
  @PrimaryGeneratedColumn('uuid')
  id:string

  @Column({nullable:true})
  title: string;

  @Column('text',{nullable:true})
  description?: string;

  @Column('float',{default:0})
  estimatedHours: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0,transformer: {
    to: (value: number) => value,
    from: (value: string) => parseFloat(value) // Converts string back to number on fetch because the database returns decimal as string
  }})
  cost: number;

  @Column({
      type:'enum',
      enum:TaskStatus,
      default:TaskStatus.OPEN
    })
    status:TaskStatus
  
  @Column({type:"timestamptz",nullable:true})
  completedAt:Date;
  
  @Column({type:"timestamptz",nullable:true})
  assignedAt:Date;

  @Column({type:"timestamptz",nullable:true})
  dueDate:Date;

  @CreateDateColumn()
  createdAt :Date
  
  @UpdateDateColumn()
  updatedAt:Date

  @ManyToMany(() => User, (user) => user.tasks)
  @JoinTable()
  assignedUsers ?: User[];
}