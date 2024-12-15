// src/auth/services/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmployeesService } from '../employees/employees.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private employeesService: EmployeesService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // 檢查 email 是否已存在
    const existingUser = await this.employeesService.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    try {
      // 建立新使用者
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const newUser = await this.employeesService.create({
        ...registerDto,
        password: hashedPassword,
      });

      // 移除密碼後回傳使用者資料和 token
      const { password, ...result } = newUser.toObject();
      return {
        user: result,
        access_token: this.generateToken(result),
      };
    } catch (error) {
      throw new BadRequestException('Registration failed');
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        position: user.position,
      },
      access_token: this.generateToken(user),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.employeesService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  private generateToken(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
      role: UserRole.ADMIN,
    };
    return this.jwtService.sign(payload);
  }
}
