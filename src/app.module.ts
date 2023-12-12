import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { TracksModule } from './tracks/track.module';
import { FavsModule } from './favs/favs.module';
import * as ormconfig from '../ormconfig.js';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` }),
    TypeOrmModule.forRoot(ormconfig),
    UsersModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    FavsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
