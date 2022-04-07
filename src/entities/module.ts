import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Operation } from './operation';

@Entity()
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  icon: string;

  @OneToMany(() => Operation, (o) => o.module, { onDelete: 'CASCADE' })
  operations: Operation[];
}
