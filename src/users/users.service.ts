import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { PaginatedResponse } from 'src/common/pagination/paginated-response.interface';
import { FilterQueryDto } from './dto/filter-user.dto';
import { TaskStatus } from 'src/tasks/task.entity';

@Injectable()
export class UsersService {

  
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  // async findAll(filters: { name?: string; email?: string; role?: string }) {
  //   const query = this.userRepository.createQueryBuilder('user')
  //     // Join only with completed tasks to calculate the specific metrics required
  //     .leftJoin('user.tasks', 'task', 'task.isCompleted = :status', { status: true })
  //     .select([
  //       'user.id AS id',
  //       'user.name AS name',
  //       'user.email AS email',
  //       'user.role AS role',
  //     ])
  //     // Requirement: Count of completed tasks 
  //     .addSelect('COUNT(task.id)', 'completedTasksCount')
  //     // Requirement: Sum of the cost of completed tasks 
  //     .addSelect('COALESCE(SUM(task.cost), 0)', 'totalCompletedCost')
  //     .groupBy('user.id');

  //   // Requirement: Filter by name, email, and/or role 
  //   if (filters.name) {
  //     query.andWhere('user.name ILIKE :name', { name: `%${filters.name}%` });
  //   }
  //   if (filters.email) {
  //     query.andWhere('user.email ILIKE :email', { email: `%${filters.email}%` });
  //   }
  //   if (filters.role) {
  //     query.andWhere('user.role = :role', { role: filters.role });
  //   }

  //   return query.getRawMany();
  // }

  async findUserById(userId: string): Promise<User> {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['tasks'],
      });
      if (!user) {
        throw new NotFoundException(`User with ID "${userId}" not found`);
      }
      return user;
    }

  async findAll(query:FilterQueryDto) :Promise<PaginatedResponse<User>>{
    const {page = 1,limit=10,name, email, role} = query
    const skip =  (page-1)*limit
    
    const queryBuilder = this.userRepository.createQueryBuilder('user')
  .leftJoin('user.tasks', 'task', 'task.status = :status', { status: TaskStatus.CLOSED })
  .select([
    'user.id',
    'user.name',
    'user.email',
    'user.role',
    
  ])
  .addSelect('COUNT(task.id)', 'completedTasksCount')
  .addSelect('SUM(COALESCE(task.cost, 0))', 'totalCompletedCost')
  .groupBy('user.id')
  .skip(skip)
  .take(limit);
    
    if(name){
      queryBuilder.andWhere('user.name ILIKE :name', { name: `%${name}%` });
    }
    if(email){
      queryBuilder.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }
    if(role){
      queryBuilder.andWhere('user.role = :role', { role });
    }
    // 1. Get the data (Entities + Aggregates)
  const rawAndEntities = await queryBuilder.getRawAndEntities();

  const totalItems = await queryBuilder.getCount();

  // 3. Map the data so the counts/costs are included in the items
  const items = rawAndEntities.entities.map((user, index) => {
    const raw = rawAndEntities.raw[index];
    return {
      ...user,
      completedTasksCount: parseInt(raw.completedTasksCount) || 0,
      totalCompletedCost: parseFloat(raw.totalCompletedCost) || 0,
    };
  });

  // 4. Build your response object
  const totalPages = Math.ceil(totalItems / limit);

  const responseResult = {
    items,
    meta: {
      currentPage: page,
      itemsperPage: limit,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    }
  };

  return responseResult;
      
  }
  async create_user(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email:createUserDto.email } });
    
    if(existingUser){
      throw new ConflictException('User with this email already exists');
    }
    const user = this.userRepository.create({
      name:createUserDto.name,
      email:createUserDto.email,
      role: createUserDto.isAdmin ? UserRole.ADMIN : UserRole.USER
    });
    return this.userRepository.save(user);
  }
}
