import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { ArtistsController } from './artists.controller';
import { ArtistService } from './artist.service';
import { Favs } from 'src/favs/favs.entity';
import { Album } from 'src/albums/album.entity';
import { Track } from 'src/tracks/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Album, Artist, Favs])],
  controllers: [ArtistsController],
  providers: [ArtistService],
})
export class ArtistsModule {}
