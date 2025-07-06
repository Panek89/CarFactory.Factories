import { ApiProperty } from "@nestjs/swagger";

export class CreateFactoryDto {
  @ApiProperty({ example: 'BMW Group Werk Leipzig' })
  name: string;

  @ApiProperty({ example: 'Leipzig' })
  city: string;

  @ApiProperty({ example: 250 })
  numberOfEmployees: number;

  @ApiProperty({ example: true })
  isOpen: boolean;

  @ApiProperty({ example: '2023-01-15T08:00:00.000Z' })
  openDate: Date;

  @ApiProperty({ example: null, nullable: true })
  closeDate?: Date;
}
