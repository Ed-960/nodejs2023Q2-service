import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { AlbumsController } from './albums.controller';
import { AlbumService } from './album.service';
import { Artist } from 'src/artists/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Artist])],
  controllers: [AlbumsController],
  providers: [AlbumService],
})
export class AlbumsModule {}
