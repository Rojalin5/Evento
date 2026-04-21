import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User,UserSchema } from './schemas/user.schema';
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
@Module({
  imports:[
    MongooseModule.forFeature([
      {name:User.name,schema:UserSchema},
    ]),
    PassportModule,
    JwtModule.register({
      secret:process.env.JWT_SECRET,
      signOptions:{expiresIn:'7d'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
