import {
  BadRequestException,
  HttpException,
  HttpStatus,
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
    private readonly favsRepository: Repository<Favs>,

    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,

    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,

    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async toInit() {
    const favsArray = await this.favsRepository.findOneBy({
      id: 'favs',
    });

    if (favsArray) {
      return favsArray;
    }

    const initialFavs = this.favsRepository.create({
      artists: [],
      albums: [],
      tracks: [],
    });

    return this.favsRepository.save(initialFavs);
  }

  async getAllFavs() {
    const favs = await this.favsRepository.findOneBy({ id: 'favs' });

    const map = {};

    for (const key in favs) {
      if (key === 'artists') {
        const promises = favs[key].map(
          async (id) => await this.artistRepository.findOneBy({ id }),
        );
        map[key] = await Promise.all(promises);
      }
      if (key === 'albums') {
        const promises = favs[key].map(
          async (id) => await this.albumRepository.findOneBy({ id }),
        );
        map[key] = await Promise.all(promises);
      }
      if (key === 'tracks') {
        const promises = favs[key].map(
          async (id) => await this.trackRepository.findOneBy({ id }),
        );
        map[key] = await Promise.all(promises);
      }
    }

    return map;
  }

  async addFavs(type: 'artist' | 'album' | 'track', id: string): Promise<void> {
    const entityRepository = this.getEntityRepository(type);

    if (!entityRepository) {
      throw new BadRequestException(`Invalid entity type: ${type}`);
    }

    const getFavs = await this.favsRepository.findOneBy({ id: 'favs' });
    if (getFavs[`${type}s`].includes(id)) {
      throw new HttpException(
        `There is already such id in Favorites.${type}s`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const entity = await entityRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Entity ${type} not found`);
    }

    const favs = await this.favsRepository.findOneBy({ id: 'favs' });

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
    const existingFavs = await this.favsRepository.findOneBy({ id: 'favs' });

    const index = existingFavs[`${type}s`].indexOf(id);

    if (index === -1) {
      throw new NotFoundException(
        `${type} with id ${id} not found in favorites`,
      );
    }

    existingFavs[`${type}s`].splice(index, 1);

    await this.favsRepository.save(existingFavs);
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
