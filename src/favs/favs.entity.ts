import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Favs {
  @PrimaryColumn()
  id: string = 'favs';

  @Column('text', { array: true, default: [] })
  artists: string[];

  @Column('text', { array: true, default: [] })
  albums: string[];

  @Column('text', { array: true, default: [] })
  tracks: string[];
}
