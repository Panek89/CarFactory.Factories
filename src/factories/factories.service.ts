import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppConfigService } from 'src/configuration/app-config.service';
import { Factory } from './entities/factory.entity';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';
import { RABBITMQ_CLIENT } from 'src/infrastructure/rabbit-mq/rabbitmq.constats';
import { MassTransitService } from 'src/infrastructure/mass-transit/mass-transit.service';
import { MassTransitMessage } from 'src/infrastructure/mass-transit/models/MassTransitMessage';
import {
  FACTORY_CREATED_EVENT,
  FACTORY_UPDATED_EVENT,
} from 'src/contracts/events/FactoryEvents';
import { CARFACTORY_EMPLOYEES_CONTRACTS_NAMESPACE } from 'src/contracts/events/Consts';

@Injectable()
export class FactoriesService {
  constructor(
    @InjectRepository(Factory) private factoryRepository: Repository<Factory>,
    @Inject(RABBITMQ_CLIENT) private client: ClientProxy,
    private appConfigService: AppConfigService,
    private massTransitService: MassTransitService,
  ) {}

  async create(createFactoryDto: CreateFactoryDto) {
    const factory = this.factoryRepository.create(createFactoryDto);
    const createdFactory = await this.factoryRepository.save(factory);

    const massTransitMessage: MassTransitMessage = {
      namespace: CARFACTORY_EMPLOYEES_CONTRACTS_NAMESPACE,
      className: FACTORY_CREATED_EVENT,
      data: {
        id: createdFactory.id,
        name: createdFactory.name,
        isOpen: createdFactory.isOpen,
      },
      queue: this.appConfigService.rabbitFactoriesQueue,
    };
    await this.massTransitService.publishMessage(massTransitMessage);

    return createdFactory;
  }

  async findAll() {
    return await this.factoryRepository.find();
  }

  async findOne(id: string) {
    return await this.factoryRepository.findBy({ id });
  }

  async update(id: string, updateFactoryDto: UpdateFactoryDto) {
    const factoryToUpdate = await this.factoryRepository.findOneBy({ id });
    if (!factoryToUpdate) {
      throw new NotFoundException(`Factory with ID ${id} not found`);
    }

    Object.assign(factoryToUpdate, updateFactoryDto);
    const updatedFactory = await this.factoryRepository.save(factoryToUpdate);

    const massTransitMessage: MassTransitMessage = {
      namespace: CARFACTORY_EMPLOYEES_CONTRACTS_NAMESPACE,
      className: FACTORY_UPDATED_EVENT,
      data: {
        id: updatedFactory.id,
        name: updatedFactory.name,
        isOpen: updatedFactory.isOpen,
      },
      queue: this.appConfigService.rabbitFactoriesQueue,
    };
    await this.massTransitService.publishMessage(massTransitMessage);

    return updatedFactory;
  }

  async remove(id: string) {
    const factory = await this.factoryRepository.findOneBy({ id });
    if (!factory) {
      throw new NotFoundException(`Factory with ID ${id} not found`);
    }

    return await this.factoryRepository.remove(factory);
  }
}
