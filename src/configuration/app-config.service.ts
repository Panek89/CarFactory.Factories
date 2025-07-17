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

  get rabbitUrl(): string {
    return this.configService.get<string>('RABBITMQ_URL') ?? 'amqp://localhost:5672';
  }

  get rabbitQueue(): string {
    return this.configService.get<string>('RABBITMQ_QUEUE') ?? 'default-queue';
  }
}
