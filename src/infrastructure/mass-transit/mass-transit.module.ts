import { Module } from '@nestjs/common';
import { MassTransitService } from './mass-transit.service';
import { AppConfigModule } from 'src/configuration/app-config.module';

@Module({
  imports: [AppConfigModule],
  providers: [MassTransitService],
  exports: [MassTransitService],
})
export class MassTransitModule {}
