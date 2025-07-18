import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMqModule } from 'src/infrastructure/rabbit-mq/rabbit-mq.module';
import { AppConfigModule } from 'src/configuration/app-config.module';
import { FactoriesService } from './factories.service';
import { FactoriesController } from './factories.controller';
import { Factory } from './entities/factory.entity';
import { FactorySeederService } from 'src/db/seeder/factorySeeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Factory]), RabbitMqModule, AppConfigModule],
  controllers: [FactoriesController],
  providers: [FactoriesService, FactorySeederService],
})
export class FactoriesModule {}
