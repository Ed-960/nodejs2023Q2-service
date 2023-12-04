import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Artist } from './artist.entity';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getAllArtists(): Promise<Artist[]> {
    return await this.artistService.getAllArtists();
  }

  @Get(':id')
  async getArtistById(@Param('id') artistId: string): Promise<Artist> {
    return await this.artistService.getArtistById(artistId);
  }

  @Post()
  async createArtist(@Body() artist: Artist): Promise<Artist> {
    return await this.artistService.createArtist(artist);
  }

  @Put(':id')
  async updateArtistInfo(
    @Param('id') artistId: string,
    @Body() body: { name: string; grammy: boolean },
  ): Promise<void> {
    return await this.artistService.updateArtistInfo(
      artistId,
      body.name,
      body.grammy,
    );
  }

  @Delete(':id')
  async deleteArtist(@Param('id') artistId: string) {
    return await this.artistService.deleteArtist(artistId);
  }
}
