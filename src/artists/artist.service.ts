import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { Artist } from './artist.entity';
import { Favs } from 'src/favs/favs.entity';
import { Track } from 'src/tracks/track.entity';
import { Album } from 'src/albums/album.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,

    @InjectRepository(Favs)
    private readonly favsRepository: Repository<Favs>,

    @InjectRepository(Album)
    private albumRepository: Repository<Album>,

    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async getAllArtists(): Promise<Artist[]> {
    return await this.artistsRepository.find();
  }

  async getArtistById(id: string): Promise<Artist> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid ArtistId format');
    }

    const artist = await this.artistsRepository.findOne({ where: { id } });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async createArtist(artist: Artist): Promise<Artist> {
    if (!artist.name || typeof artist.grammy !== 'boolean') {
      throw new BadRequestException('name and gramy are required');
    }

    const newArtist = this.artistsRepository.create(artist);
    return await this.artistsRepository.save(newArtist);
  }

  async updateArtistInfo(
    id: string,
    name: string,
    grammy: boolean,
  ): Promise<void> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid ArtistId format');
    }

    const artist = await this.artistsRepository.findOne({ where: { id } });

    if (!artist) {
      throw new UnauthorizedException('Artist not found');
    }

    await this.artistsRepository.update(id, { name, grammy });
  }

  async deleteArtist(id: string): Promise<boolean> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid ArtistId format');
    }

    const artist = await this.artistsRepository.delete(id);

    if (artist.affected === 0) {
      throw new NotFoundException('Artist not found');
    }

    await this.albumRepository
      .createQueryBuilder()
      .update(Album)
      .set({ artistId: null })
      .where('artistId = :artistId', { artistId: id })
      .execute();

    await this.trackRepository
      .createQueryBuilder()
      .update(Track)
      .set({ artistId: null })
      .where('artistId = :artistId', { artistId: id })
      .execute();

    await this.favsRepository
      .createQueryBuilder()
      .update(Favs)
      .set({
        artists: () => `array_remove("artists", '${id}')`,
      })
      .execute();

    return true;
  }
}
