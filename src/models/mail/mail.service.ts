import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendActivationEmail(to: string, link: string) {
    await this.mailerService.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Account activation on ${process.env.API_URL}`,
      text: '',
      html: `
            <div>
              <h1>this is a confirmation email from the site ${process.env.CLIENT_URL}</h1>
              <a href="${link}">${link}</a>
            </div>
          `,
    })
  }
}
