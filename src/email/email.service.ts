import { Inject, Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import emailConfig from 'src/config/emailConfig';

// 메일 옵션타입을 지정한 TS 인터페이스
interface EmailOptions {
  from: string;
  to: string; // 수신자
  subject: string; // 메일제목
  html: string; // html형태의 메일 본문
}

@Injectable()
export class EmailService {
  // nodemailer에서 제공하는 transporter 객체를 생성한다
  private transporter: Mail;
  // 생성자
  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: config.service,
      host: 'smtp.naver.com',
      port: 587,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    // 유저가 누를 버튼을 만든다.
    const baseUrl = this.config.baseUrl;
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    // 메일내용을 넣는다.
    const mailOptions: EmailOptions = {
      from: '<nang6_25@naver.com>',
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
            가입확인 버튼을 누르면 가입인증이 완료됩니다.<br />
            <form action="${url}" method="POST">
                <button>가입확인</button>
            </form>
        `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
