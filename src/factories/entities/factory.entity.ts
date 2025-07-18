import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Factory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  numberOfEmployees: number;

  @Column()
  isOpen: boolean;

  @Column()
  openDate: Date;

  @Column({nullable: true})
  closeDate: Date;
}
