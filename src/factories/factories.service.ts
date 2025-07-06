import { Injectable } from '@nestjs/common';
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
    return this.factoryRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} factory`;
  }

  update(id: number, updateFactoryDto: UpdateFactoryDto) {
    return `This action updates a #${id} factory ${updateFactoryDto.name}`;
  }

  remove(id: number) {
    return `This action removes a #${id} factory`;
  }
}
