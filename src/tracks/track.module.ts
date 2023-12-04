import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from 'src/albums/album.entity';
import { Artist } from 'src/artists/artist.entity';
import { Track } from './track.entity';
import { TracksController } from './tracks.controller';
import { TrackService } from './track.service';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Album, Artist])],
  controllers: [TracksController],
  providers: [TrackService],
})
export class TracksModule {}
