import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Factory } from './entities/factory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FactoriesService {
  constructor(
    @InjectRepository(Factory) private factoryRepository: Repository<Factory>
  ) {}

  async create(createFactoryDto: CreateFactoryDto) {
    const factory = this.factoryRepository.create(createFactoryDto);
    return await this.factoryRepository.save(factory);
  }

  async findAll() {
    return await this.factoryRepository.find();
  }

  async findOne(id: number) {
    return await this.factoryRepository.findBy({id});
  }

  async update(id: number, updateFactoryDto: UpdateFactoryDto) {
    const factoryToUpdate = await this.factoryRepository.findOneBy({ id });
    if (!factoryToUpdate) {
      throw new NotFoundException(`Factory with ID ${id} not found`);
    }

    Object.assign(factoryToUpdate, updateFactoryDto);
    return await this.factoryRepository.save(factoryToUpdate);
  }

  async remove(id: number) {
    const factory = await this.factoryRepository.findOneBy({ id });
    if (!factory) {
      throw new NotFoundException(`Factory with ID ${id} not found`);
    }

    return await this.factoryRepository.remove(factory);
  }
}
