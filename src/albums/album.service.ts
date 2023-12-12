import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { Album } from './album.entity';
import { Artist } from 'src/artists/artist.entity';
import { Favs } from 'src/favs/favs.entity';
import { Track } from 'src/tracks/track.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,

    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,

    @InjectRepository(Favs)
    private readonly favsRepository: Repository<Favs>,

    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async getAllAlbums(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  async getAlbumById(id: string): Promise<Album> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid albumId format');
    }

    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async createAlbum(album: Album) {
    const { artistId } = album;

    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${artistId} not found`);
    }

    const newAlbum = this.albumRepository.create({
      ...album,
      artistId,
    });

    return await this.albumRepository.save(newAlbum);
  }

  async updateAlbum(albumId: string, updatedAlbum: Album) {
    const existingAlbum = await this.albumRepository.findOne({
      where: { id: albumId },
    });

    if (!existingAlbum) {
      throw new NotFoundException(`Album with ID ${albumId} not found`);
    }

    this.albumRepository.merge(existingAlbum, updatedAlbum);

    return await this.albumRepository.save(existingAlbum);
  }

  async deleteAlbum(albumId: string) {
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
    });

    if (!album) {
      throw new NotFoundException(`Album with ID ${albumId} not found`);
    }

    await this.trackRepository
      .createQueryBuilder()
      .update(Track)
      .set({ albumId: null })
      .where('albumId = :albumId', { albumId })
      .execute();

    await this.favsRepository
      .createQueryBuilder()
      .update(Favs)
      .set({
        albums: () => `array_remove("artists", '${albumId}')`,
      })
      .execute();

    await this.albumRepository.remove(album);
  }
}
