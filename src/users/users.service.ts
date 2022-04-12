import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';
import * as uuid from 'uuid';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService, //
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}
  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입이 불가능합니다.',
      );
    }

    const signupVerifyToken = uuid.v1();
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email: emailAddress },
    });
    return user !== undefined;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // todos
    // 1. DB에서 토큰으로 회원가입중인 유저가있다면 true 없으면 에러
    // 2. 바로 로그인이 되도록 jwt를 발급시킨다.

    throw new Error('Method not implemented');
  }

  async login(email: string, password: string): Promise<string> {
    // todos
    // 1. email, password 가진 유저가 db에있다면 처리, 없으면 에러
    // 2. JWT를 발급해 전달

    throw new Error('method not implemented');
  }

  async getUserInfo(userId: string): Promise<string> {
    // todos
    // 1. userId를 DB에서 조회해 없다면 에러
    // 2. 조회된 데이터를 UserInfo 타입으로 전달

    throw new Error('Method not implemented');
  }
}
