import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { AlbumsController } from './albums.controller';
import { AlbumService } from './album.service';
import { Artist } from 'src/artists/artist.entity';
import { Track } from 'src/tracks/track.entity';
import { Favs } from 'src/favs/favs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Album, Artist, Favs])],
  controllers: [AlbumsController],
  providers: [AlbumService],
})
export class AlbumsModule {}
