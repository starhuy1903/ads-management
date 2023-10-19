import { SESClient } from '@aws-sdk/client-ses';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsSesService {
  private sesClient: SESClient;
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    this.sesClient = new SESClient({
      region: this.configService.get('aws.region'),
      credentials: {
        secretAccessKey: this.configService.get('aws.secretAccessKey'),
        accessKeyId: this.configService.get('aws.accessKeyId'),
      },
    });
  }
  getSesClient(): SESClient {
    return this.sesClient;
  }
}
