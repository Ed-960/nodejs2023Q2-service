import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  async getFavs() {
    return this.favsService.getAllFavs();
  }

  @Post('/artist/:id')
  async addArtistToFavs(@Param('id') id: string): Promise<void> {
    await this.favsService.addFavs('artist', id);
  }

  @Delete('/artist/:id')
  async removeArtistfromFavs(@Param('id') id: string): Promise<void> {
    await this.favsService.removeFavs('artist', id);
  }

  @Post('/album/:id')
  async addAlbumToFavs(@Param('id') id: string): Promise<void> {
    await this.favsService.addFavs('album', id);
  }

  @Delete('/album/:id')
  async removeAlbumFromFavs(@Param('id') id: string): Promise<void> {
    await this.favsService.removeFavs('album', id);
  }

  @Post('/track/:id')
  async addTrackToFavs(@Param('id') id: string): Promise<void> {
    await this.favsService.addFavs('track', id);
  }

  @Delete('/track/:id')
  async removeTrackFromFavs(@Param('id') id: string): Promise<void> {
    await this.favsService.removeFavs('track', id);
  }
}
