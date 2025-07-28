import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FactoriesService } from './factories.service';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('factories')
@Controller('factories')
@UseGuards(JwtAuthGuard)
export class FactoriesController {
  constructor(private readonly factoriesService: FactoriesService) {}

  @Post()
  create(@Body() createFactoryDto: CreateFactoryDto) {
    return this.factoriesService.create(createFactoryDto);
  }

  @Get()
  findAll() {
    return this.factoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.factoriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFactoryDto: UpdateFactoryDto) {
    return this.factoriesService.update(id, updateFactoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.factoriesService.remove(id);
  }
}
