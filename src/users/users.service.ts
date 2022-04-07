import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

@Injectable()
export class UsersService {
  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinemail(email, signupVerifyToken);
  }

  private checkUserExists(email: string) {
    return false; // TODO: DB 연동후 구현한다.
  }

  private saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    return; // TODO: DB연동후 구현
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
