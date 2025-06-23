import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FactoriesController } from './factories/factories.controller';
import { FactoriesModule } from './factories/factories.module';

@Module({
  imports: [FactoriesModule],
  controllers: [AppController, FactoriesController],
  providers: [AppService],
})
export class AppModule {}
