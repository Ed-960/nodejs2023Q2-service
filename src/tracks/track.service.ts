import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { Artist } from 'src/artists/artist.entity';
import { Track } from './track.entity';
import { Album } from 'src/albums/album.entity';
import { Favs } from 'src/favs/favs.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,

    @InjectRepository(Album)
    private albumRepository: Repository<Album>,

    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,

    @InjectRepository(Favs)
    private readonly favsRepository: Repository<Favs>,
  ) {}

  async getAllTracks(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async getTrackById(trackId: string): Promise<Track> {
    if (!isValidUUID(trackId)) {
      throw new BadRequestException('Invalid. tracktId format');
    }

    const track = await this.trackRepository.findOne({
      where: { id: trackId },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async createTrack(track: Track) {
    const { artistId, albumId } = track;

    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });

    const album = await this.albumRepository.findOne({
      where: { id: albumId },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${artistId} not found`);
    } else if (!album) {
      throw new NotFoundException(`Album with ID ${albumId} not found`);
    }

    const newTrack = this.trackRepository.create({
      ...track,
      artistId,
      albumId,
    });

    return await this.trackRepository.save(newTrack);
  }

  async updateTrack(trackId: string, updatedTrack: Track) {
    const existingTrack = await this.trackRepository.findOne({
      where: { id: trackId },
    });

    if (!existingTrack) {
      throw new NotFoundException(`Track with ID ${trackId} not found`);
    }

    this.trackRepository.merge(existingTrack, updatedTrack);

    return await this.trackRepository.save(updatedTrack);
  }

  async deleteTrack(trackId: string) {
    const track = await this.trackRepository.findOne({
      where: { id: trackId },
    });

    await this.favsRepository
      .createQueryBuilder()
      .update(Favs)
      .set({
        tracks: () => `array_remove("tracks", '${trackId}')`,
      })
      .execute();

    if (!track) {
      throw new NotFoundException(`Track with ID ${trackId} not found`);
    }
  }
}
