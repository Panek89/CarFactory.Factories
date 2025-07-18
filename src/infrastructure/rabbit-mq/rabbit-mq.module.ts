import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfigModule } from 'src/configuration/app-config.module';
import { AppConfigService } from 'src/configuration/app-config.service';
import { RABBITMQ_CLIENT } from './rabbitmq.constats';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RABBITMQ_CLIENT,
        imports: [AppConfigModule],
        inject: [AppConfigService],
        useFactory: (configService: AppConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.rabbitUrl],
              queue: configService.rabbitQueue,
              queueOptions: { durable: false },
            },
        })
      },
    ]),
  ],
  exports: [ClientsModule],
})

export class RabbitMqModule {}
