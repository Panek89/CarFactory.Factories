import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

	get dbType(): string {
		return this.configService.get<string>('DB_TYPE') ?? 'mssql';
	}

  get dbHost(): string {
    return this.configService.get<string>('DB_HOST') ?? 'localhost';
  }

  get dbPort(): number {
		const value = this.configService.get<string>('DB_PORT') ?? '1433';
		return parseInt(value);
	}

	get dbUsername(): string {
		return this.configService.get<string>('DB_USERNAME') ?? 'sa';
	}

	get dbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD') ?? '';
  }

  get dbName(): string {
    return this.configService.get<string>('DB_NAME') ?? 'CarFactory_Factories';
  }

  get rabbitPort(): string {
    return this.configService.get<string>('RABBITMQ_PORT') ?? '5672';
  }

  get rabbitServiceName(): string {
    return this.configService.get<string>('RABBITMQ_SERVICE_NAME') ?? 'localhost';
  }

  get rabbitUser(): string {
    return this.configService.get<string>('RABBITMQ_USER') ?? 'guest';
  }

  get rabbitPassword(): string {
    return this.configService.get<string>('RABBITMQ_PASSWORD') ?? 'guest';
  }

  get rabbitFactoriesQueue(): string {
    return this.configService.get<string>('RABBITMQ_FACTORIES_QUEUE') ?? 'default-queue';
  }

  get rabbitUrl(): string {
    return `amqp://${this.rabbitUser}:${this.rabbitPassword}@${this.rabbitServiceName}:${this.rabbitPort}`;
  }
}
