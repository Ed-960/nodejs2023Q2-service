import { TrackService } from './track.service';
import { Track } from './track.entity';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
@Controller('track')
export class TracksController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async getAllTracks(): Promise<Track[]> {
    return await this.trackService.getAllTracks();
  }

  @Get(':id')
  async getTrackById(@Param('id') trackId: string): Promise<Track> {
    return await this.trackService.getTrackById(trackId);
  }

  @Post()
  async createTrack(@Body() track: Track): Promise<Track> {
    return await this.trackService.createTrack(track);
  }

  @Put(':id')
  async updateTrack(
    @Param('id') trackId: string,
    @Body() body: Partial<Track>,
  ): Promise<Track> {
    return await this.trackService.updateTrack(trackId, body as Track);
  }

  @Delete(':id')
  async deleteTrack(@Param('id') trackId: string) {
    return await this.trackService.deleteTrack(trackId);
  }
}
