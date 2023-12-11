import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from 'src/artists/artist.entity';
import { Album } from 'src/albums/album.entity';
import { Track } from 'src/tracks/track.entity';
import { Favs } from './favs.entity';

@Injectable()
export class FavsService {
  constructor(
    @InjectRepository(Favs)
    private favsRepository: Repository<Favs>,

    @InjectRepository(Track)
    private trackRepository: Repository<Track>,

    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,

    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
  ) {}

  async getAllFavs() {
    const favsArray = await this.favsRepository.find();

    if (!favsArray) {
      return {
        artists: [],
        albums: [],
        tracks: [],
      };
    }

    const favs = favsArray[0];

    if (!favs.artists) {
      favs.artists = [];
    }

    if (!favs.albums) {
      favs.albums = [];
    }

    if (!favs.tracks) {
      favs.tracks = [];
    }

    return favs;
  }

  async addFavs(type: 'artist' | 'album' | 'track', id: string): Promise<void> {
    const entityRepository = this.getEntityRepository(type);

    if (!entityRepository) {
      throw new BadRequestException(`Invalid entity type: ${type}`);
    }

    const entity = await entityRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Entity ${type} not found`);
    }

    const favs = await this.getAllFavs();

    switch (type) {
      case 'artist':
        favs.artists.push(id);
        break;
      case 'album':
        favs.albums.push(id);
        break;
      case 'track':
        favs.tracks.push(id);
        break;
      default:
        throw new BadRequestException('Invalid entity type');
    }

    await this.favsRepository.save(favs);
  }

  async removeFavs(
    type: string | 'album' | 'track',
    id: string,
  ): Promise<void> {
    const entityRepository = this.getEntityRepository(type);

    if (!entityRepository) {
      throw new BadRequestException(`Invalid entity type: ${type}`);
    }

    const entity = await entityRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(
        `${type} with id ${id} not found in favorites`,
      );
    }

    await this.favsRepository.delete({ [type]: entity });
  }

  private getEntityRepository(
    type: string,
  ): Repository<Artist | Album | Track> | undefined {
    switch (type) {
      case 'artist':
        return this.artistRepository;
      case 'album':
        return this.albumRepository;
      case 'track':
        return this.trackRepository;
      default:
        return undefined;
    }
  }
}
