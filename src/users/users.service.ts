import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER, CacheKey } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PaginatedResponse } from 'src/common/pagination/paginated-response.interface';
import { FilterQueryDto } from './dto/filter-user.dto';
import { TaskStatus } from 'src/tasks/task.entity';


@Injectable()
export class UsersService {

  constructor(@InjectRepository(User)
  private readonly userRepository: Repository<User>,
  
  @Inject(CACHE_MANAGER) 
    private cacheManager:Cache,
) {}

  private postListCacheKeys:Set<string>=new Set();
  private generatePostsListCacheKey(query:FilterQueryDto):string{
    const {page = 1,limit=10,name,email,role} = query
    return `posts_list_page ${page} _limit ${limit}_name${name || 'all'}_email${email || 'all'}_role${role || 'all'}`
  }
  private async invalidExistingCache() :Promise<void>{
    console.log("Invalidateing exisiting caches")
    for (const key of this.postListCacheKeys){
      await this.cacheManager.del(key)
    
    }
    this.postListCacheKeys.clear();
  }


  async findAll(query:FilterQueryDto) :Promise<PaginatedResponse<User>>{


    const cacheKey = this.generatePostsListCacheKey(query);
    this.postListCacheKeys.add(cacheKey);
    const cachedData = await this.cacheManager.get<PaginatedResponse<User>>(cacheKey);
    if(cachedData){
      console.log("Returning cached data for key:", cacheKey);
      return cachedData;
    }
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
    
  const rawAndEntities = await queryBuilder.getRawAndEntities();

  const totalItems = await queryBuilder.getCount();

  
  const items = rawAndEntities.entities.map((user, index) => {
    const raw = rawAndEntities.raw[index];
    return {
      ...user,
      completedTasksCount: parseInt(raw.completedTasksCount) || 0,
      totalCompletedCost: parseFloat(raw.totalCompletedCost) || 0,
    };
  });

  
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
  await this.cacheManager.set(cacheKey, responseResult, 30000);
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
    await this.invalidExistingCache()
    return this.userRepository.save(user);
  }
}
