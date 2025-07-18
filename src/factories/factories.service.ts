import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppConfigService } from 'src/configuration/app-config.service';
import { Factory } from './entities/factory.entity';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';
import { CreatedFactoryDto } from './dto/created-factory.dto';
import { RABBITMQ_CLIENT } from 'src/infrastructure/rabbit-mq/rabbitmq.constats';

@Injectable()
export class FactoriesService {
  constructor(
    @InjectRepository(Factory) private factoryRepository: Repository<Factory>,
    @Inject(RABBITMQ_CLIENT) private client: ClientProxy,
    private appConfigService: AppConfigService
  ) {
  }

  async create(createFactoryDto: CreateFactoryDto) {
    const factory = this.factoryRepository.create(createFactoryDto);

    const createdFactory = await this.factoryRepository.save(factory);
    const createdFactoryDto: CreatedFactoryDto = {
      id: createdFactory.id,
      name: createdFactory.name,
      city: createdFactory.city,
      numberOfEmployees: createdFactory.numberOfEmployees
    }

    this.client.emit(this.appConfigService.rabbitQueue, createdFactoryDto);
    
    return createdFactory;
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
    const updatedFactory = await this.factoryRepository.save(factoryToUpdate);
    this.client.emit(this.appConfigService.rabbitQueue, updatedFactory);
    
    return updatedFactory;
  }

  async remove(id: number) {
    const factory = await this.factoryRepository.findOneBy({ id });
    if (!factory) {
      throw new NotFoundException(`Factory with ID ${id} not found`);
    }

    return await this.factoryRepository.remove(factory);
  }
}
