import { Album } from './album.entity';
import { AlbumService } from './album.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumService) {}

  @Get()
  async getAllAlbums(): Promise<Album[]> {
    return await this.albumsService.getAllAlbums();
  }

  @Get(':id')
  async getAlbumById(@Param('id') albumId: string): Promise<Album> {
    return await this.albumsService.getAlbumById(albumId);
  }

  @Post()
  async createAlbum(@Body() album: Album): Promise<Album> {
    return await this.albumsService.createAlbum(album);
  }

  @Put(':id')
  async updateAlbum(
    @Param('id') albumId: string,
    @Body() body: Partial<Album>,
  ): Promise<Album> {
    return await this.albumsService.updateAlbum(albumId, body as Album);
  }

  @Delete(':id')
  async deleteAlbum(@Param('id') albumId: string) {
    return await this.albumsService.deleteAlbum(albumId);
  }
}
