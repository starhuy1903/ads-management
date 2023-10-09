import { Agenda } from '@hokify/agenda';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { MailScheduleDto, SchedulePriority } from './schedule.dto';
import { SendMailTemplateDto } from '../mail/mail.dto';

@Injectable()
export class ScheduleService {
  private agenda: Agenda;
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    const mongoConnectionString = this.configService.get('agendaDb');
    this.agenda = new Agenda({ db: { address: mongoConnectionString } });

    this.defineSendVerifyEmailJob();

    this.setupHook();

    this.agenda.start();
  }

  async createScheduleSendEmail(
    name: string,
    priority: SchedulePriority,
    time: string,
    mailInfo: SendMailTemplateDto,
    maxRetry = 0,
  ) {
    const jobData: MailScheduleDto = {
      name: name,
      priority: priority ?? SchedulePriority.normal,
      time: time,
      maxRetry: maxRetry ?? 0,
      mailInfo,
    };
    const job = this.agenda.create('send-verify-email', jobData);
    job.schedule(new Date(jobData.time));
    job.priority(jobData.priority);
    job.attrs.failCount = 0;
    await job.save();
    return {
      msg: 'send email was scheduled successfully',
      jobId: job.attrs._id.toString(),
    };
  }

  defineSendVerifyEmailJob() {
    this.agenda.define('send-verify-email', async (job) => {
      try {
        // await this.mailService.sendVerifyEmail();
        const data = job.attrs.data;
        await this.mailService.sendEmailTemplate(
          data.mailInfo as SendMailTemplateDto,
        );
      } catch (error) {
        console.error(
          `Job ${job.attrs.name} failed with error: ${error.message}`,
        );
        if (job.attrs.failCount < job.attrs.data.maxRetry) {
          job.attrs.failCount = job.attrs.failCount + 1;
          job.attrs.nextRunAt = new Date(Date.now() + 1000 * 60 * 0.1); // Retry after 10 seconds
          await job.save(); // Save the job back to MongoDB
        } else {
          throw new Error(error);
        }
      }
    });
  }

  setupHook() {
    this.agenda.on('start', (job) => {
      console.log(
        `Job ${job.attrs.name}-${job.attrs._id} starting  at ${new Date()}`,
      );
    });

    this.agenda.on('complete', (job) => {
      console.log(
        `Job ${job.attrs.name}-${job.attrs._id} finished at ${new Date()}`,
      );
    });

    this.agenda.on('success', (job) => {
      if (job.attrs.nextRunAt)
        console.log(
          `Job ${job.attrs.name}-${job.attrs._id} retry at ${job.attrs.nextRunAt}`,
        );
      else console.log(`Sent ${job.attrs.name}-${job.attrs._id} Successfully `);
    });

    this.agenda.on('fail', (err, job) => {
      console.log(
        `Job ${job.attrs.name}-${job.attrs._id} failed with error: ${err.message}`,
      );
    });
  }
}
