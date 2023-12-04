import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavsController } from './favs.controller';
import { FavsService } from './favs.service';
import { Track } from 'src/tracks/track.entity';
import { Album } from 'src/albums/album.entity';
import { Artist } from 'src/artists/artist.entity';
import { Favs } from './favs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favs, Track, Album, Artist])],
  controllers: [FavsController],
  providers: [FavsService],
})
export class FavsModule {}
