import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Module } from './module';
import { User } from './user';

@Entity()
export class Operation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  activityName: string;

  @ManyToMany(() => User, (u) => u.operations)
  users: User[];

  @Column({ type: 'uuid' })
  moduleId: string;

  @ManyToOne(() => Module, (m) => m.operations)
  @JoinColumn({ name: 'moduleId' })
  module: Module;
}
