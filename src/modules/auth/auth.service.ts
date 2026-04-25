import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async register(dto: RegisterDto) {
    const exists = await this.userModel.findOne({
      email: dto.email,
    });
    if (exists) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
      role: 'user',
    });
    return {
      message: 'User registered successfully',
      user,
    };
  }
  async Login(dto: LoginDto) {
    const user = await this.userModel.findOne({
      email: dto.email
    }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      role: user.role,
    });
    return {
      message: 'Login Successful',
      accessToken: token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
