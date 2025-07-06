// seeder.service.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Factory } from 'src/factories/entities/factory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FactorySeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Factory)
    private readonly factoryRepository: Repository<Factory>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.factoryRepository.count();
    if (count === 0) {
      console.log('Factory table empty, data will add');
      const factories = this.factoryRepository.create([
        {
          name: 'BMW Werk Dingolfing',
          city: 'Dingolfing',
          numberOfEmployees: 120,
          isOpen: true,
          openDate: new Date('2022-01-01'),
        },
        {
          name: 'BMW Werk Leipzig',
          city: 'Leipzig',
          numberOfEmployees: 80,
          isOpen: true,
          openDate: new Date('2020-05-15'),
        },
      ]);
      await this.factoryRepository.save(factories);
      console.log('Database seed correct');
    }
  }
}