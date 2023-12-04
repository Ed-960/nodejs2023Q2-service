import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { TracksModule } from './tracks/track.module';
import { FavsModule } from './favs/favs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: `${process.env.POSTGRES_PASSWORD}`,
      database: process.env.POSTGRES_DB,
      synchronize: true,
      logging: true,
      entities: ['dist/**/*.entity.js'],
      migrations: ['src/migrations/*.ts'],
    }),
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
