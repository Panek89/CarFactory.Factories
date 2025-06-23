import { Injectable } from '@nestjs/common';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';

@Injectable()
export class FactoriesService {
  create(createFactoryDto: CreateFactoryDto) {
    return 'This action adds a new factory';
  }

  findAll() {
    return `This action returns all factories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} factory`;
  }

  update(id: number, updateFactoryDto: UpdateFactoryDto) {
    return `This action updates a #${id} factory`;
  }

  remove(id: number) {
    return `This action removes a #${id} factory`;
  }
}
