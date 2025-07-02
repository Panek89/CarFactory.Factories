import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FactoriesModule } from './factories/factories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factory } from './factories/entities/factory.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT')!),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        options: {
          trustServerCertificate: true,
        },
        entities: [Factory],
        synchronize: true,
      }),
    }),
    FactoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
