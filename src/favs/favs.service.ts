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

  async getFavs(): Promise<{
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
  }> {
    const favs = await this.favsRepository.find({
      relations: ['artist', 'album', 'track'],
    });

    const artists = favs.map((fav) => fav.artist).filter(Boolean) as Artist[];
    const albums = favs.map((fav) => fav.album).filter(Boolean) as Album[];
    const tracks = favs.map((fav) => fav.track).filter(Boolean) as Track[];

    return { artists, albums, tracks };
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

    await this.favsRepository.save({ [type]: entity });
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
