import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Employee } from './schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);
    const createdEmployee = new this.employeeModel({
      ...createEmployeeDto,
      password: hashedPassword,
    });
    return createdEmployee.save();
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeModel.find().exec();
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeModel.findById(id).exec();
    if (!employee) {
      throw new NotFoundException(`員工ID ${id} 不存在`);
    }
    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    if (updateEmployeeDto.password) {
      updateEmployeeDto.password = await bcrypt.hash(
        updateEmployeeDto.password,
        10,
      );
    }

    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(id, updateEmployeeDto, { new: true })
      .exec();

    if (!updatedEmployee) {
      throw new NotFoundException(`員工ID ${id} 不存在`);
    }
    return updatedEmployee;
  }

  async remove(id: string): Promise<Employee> {
    const deletedEmployee = await this.employeeModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedEmployee) {
      throw new NotFoundException(`員工ID ${id} 不存在`);
    }
    return deletedEmployee;
  }
}
