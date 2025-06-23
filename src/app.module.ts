import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FactoriesModule } from './factories/factories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factory } from './factories/entities/factory.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: 'Password',
      database: 'CarFactory.Factories',
      options: {
        trustServerCertificate: true,
      },
      entities: [Factory],
      synchronize: true,
    }),
    FactoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
