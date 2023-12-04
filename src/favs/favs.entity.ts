import { Album } from 'src/albums/album.entity';
import { Artist } from 'src/artists/artist.entity';
import { Track } from 'src/tracks/track.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Favs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Artist, { nullable: true })
  artist: Artist;

  @ManyToOne(() => Album, { nullable: true })
  album: Album;

  @ManyToOne(() => Track, { nullable: true })
  track: Track;
}
