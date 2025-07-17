import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FactoriesModule } from './factories/factories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factory } from './factories/entities/factory.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigModule } from './configuration/app-config.module';
import { AppConfigService } from './configuration/app-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: 'mssql',
        host: config.dbHost,
        port: config.dbPort,
        username: config.dbUsername,
        password: config.dbPassword,
        database: config.dbName,
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
