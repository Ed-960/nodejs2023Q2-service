import { Artist } from 'src/artists/artist.entity';
import { Album } from 'src/albums/album.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Artist, { nullable: true })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @ManyToOne(() => Album, { nullable: true })
  @JoinColumn({ name: 'albumId' })
  album: Album;

  @Column()
  artistId: string;

  @Column()
  albumId: string;

  @Column()
  duration: number;
}
