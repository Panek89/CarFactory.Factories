import { Injectable, Logger } from '@nestjs/common';
import { MassTransitMessage } from './models/MassTransitMessage';
import { v4 as uuid } from 'uuid';
import * as amqp from 'amqplib';
import { AppConfigService } from 'src/configuration/app-config.service';

@Injectable()
export class MassTransitService {
	private readonly logger = new Logger(MassTransitService.name);

	constructor(private appConfigService: AppConfigService) { }

	async publishMessage(message: MassTransitMessage): Promise<void> {
    let connection: amqp.Connection | null = null;
    let channel: amqp.Channel | null = null;

    try {
      const connectionString = this.appConfigService.rabbitUrl;
      connection = await amqp.connect(connectionString);
      channel = await connection.createChannel();

      await channel.assertQueue(message.queue, { durable: true });

      const envelope = this.createEnvelope(message);
      const urn = this.generateUrn(message.namespace, message.className);

      channel.sendToQueue(
        message.queue,
        Buffer.from(JSON.stringify(envelope)),
        {
          contentType: 'application/vnd.masstransit+json',
          deliveryMode: 2,
          headers: {
            'MT-Message-Type': urn
          },
					messageId: envelope.messageId,
          correlationId: envelope.conversationId,
          timestamp: Date.now()
        }
      );

      this.logger.log(`Message sent to queue ${message.queue}: ${message.className}`);
    } catch (error) {
      this.logger.error(`Failed to send message: ${error.message}`, error.stack);
      throw error;
    } finally {
      if (channel) await channel.close();
      if (connection) await connection.close();
    }
  }

	private generateUrn(namespace: string, className: string): string {
    return `urn:message:${namespace}:${className}`;
  }

	private createEnvelope(message: MassTransitMessage) {
    const urn = this.generateUrn(message.namespace, message.className);
    
    return {
      messageId: uuid(),
      conversationId: uuid(),
      sourceAddress: `rabbitmq://${this.appConfigService.rabbitServiceName}/`,
      destinationAddress: `rabbitmq://${this.appConfigService.rabbitServiceName}/${this.appConfigService.rabbitFactoriesQueue}`,
      messageType: [urn],
      message: message.data,
      sentTime: new Date().toISOString(),
      headers: {},
			expirationTime: null,
      requestId: null,
      correlationId: null,
      initiatorId: null,
      scheduledTime: null
    };
  }
}
