import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Favs {
  @PrimaryColumn()
  id: string;

  @Column('uuid', { array: true, nullable: true })
  artists: string[];

  @Column('uuid', { array: true, nullable: true })
  albums: string[];

  @Column('uuid', { array: true, nullable: true })
  tracks: string[];
}
