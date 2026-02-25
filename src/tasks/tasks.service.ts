import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { Tasks, TaskStatus } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';
import { User } from 'src/users/user.entity';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { PaginatedResponse } from 'src/common/pagination/paginated-response.interface';
import { FilterTaskQueryDto } from './dto/fillter-task.dto';
import { UsersFilterDto } from 'src/users/dto/filter-user.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private readonly taskRepository: Repository<Tasks>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  async findAll(query:FilterTaskQueryDto): Promise<PaginatedResponse<Tasks>> {
    const {page = 1,limit=10,status,title,user_email,dueDate} = query
    const skip =  (page-1)*limit
    const queryBuilder = this.taskRepository.createQueryBuilder('tasks')
    .leftJoinAndSelect('tasks.assignedUsers', 'user').orderBy('tasks.createdAt', 'DESC').addOrderBy('tasks.dueDate', 'ASC').skip(skip).take(limit);
    
    if (status) {
      queryBuilder.andWhere('tasks.status = :status', { status });
    }
    if (title) {
      queryBuilder.andWhere('tasks.title ILIKE :title', { title: `%${title}%` });
    }
    if (user_email) {
      queryBuilder.andWhere('user.email ILIKE :email', { email: `%${user_email}%` });
    }
    if (dueDate) {
      const startOfDay = new Date(dueDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dueDate);
      endOfDay.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('tasks.dueDate BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay });
    }
    const [items,totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems/limit)
    const responseResult={
      items,
      meta:{
        currentPage:page,
        itemsperPage:limit,
        totalItems,
        totalPages,
        hasPreviousPage:page>1,
        hasNextPage:page<totalPages,
      }
    }
    return responseResult
  }
  async createTask(createTaskDto:CreateTaskDto):Promise<Tasks>{
    if (createTaskDto.dueDate && new Date(createTaskDto.dueDate) < new Date()) {
      throw new BadRequestException('Cannot set a due date in the past');
    }
    const task = this.taskRepository.create({
      title:createTaskDto.title,
      description:createTaskDto.description,
      cost:createTaskDto.cost,
      estimatedHours : createTaskDto.estimatedHours,
      dueDate : createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined
    });
    
    task.status = TaskStatus.OPEN
    
    if (createTaskDto.assignedUserIds && createTaskDto.assignedUserIds.length > 0) {
    
      const users = await this.userRepository.find({
        where: { id: In(createTaskDto.assignedUserIds) }
        
      });
      
      if (users.length !== createTaskDto.assignedUserIds.length) {
        throw new NotFoundException('One or more users not found for the provided IDs');
      }
      task.status = TaskStatus.ASSIGNED
      task.assignedUsers = users;
      task.assignedAt = new Date();
    
    }
    return this.taskRepository.save(task);
  }
  async findTaskPastDueDate(): Promise<Tasks[]> {
    const now = new Date();
    return this.taskRepository.find({
      relations: ['assignedUsers'],
      where: { dueDate: LessThan(now), status: In([TaskStatus.OPEN, TaskStatus.ASSIGNED]) },
      order: { dueDate: 'ASC' }
    });
  }
  async findTasksByUserEmail(userEmail: string): Promise<User> {
  const user = await this.userRepository.findOne({
    where: { email: userEmail },
    relations: ['tasks', 'tasks.assignedUsers']
  });

  if (!user) throw new NotFoundException('User not found');
  
  return user;
}
  
  async unassignedTasks(): Promise<Tasks[]> {
    return this.taskRepository
    .createQueryBuilder('task')
    .leftJoinAndSelect('task.assignedUsers', 'user')
    
    .where('user.id IS NULL') 
    .getMany();
  }

  async findTaskById(taskId: string): Promise<Tasks> {
    const task = await this.taskRepository.findOne({ where: { id: taskId }, relations: ['assignedUsers'] });
    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }
    return task;
  }

  async update_task(id: string, updateTaskDto: UpdateTaskDto): Promise<Tasks> {
   
    const task = await this.taskRepository.findOne({ 
        where: { id },
        relations: ['assignedUsers'] 
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    
    if (updateTaskDto.assignedUserIds) {
      
      const users = await this.userRepository.find({
        where: { id: In(updateTaskDto.assignedUserIds) }
      });
      
      if (users.length !== updateTaskDto.assignedUserIds.length) 
        throw new NotFoundException('One or more users not found for the provided IDs');
      
      if (users.length > 0) {
        task.status = TaskStatus.ASSIGNED;
        if(!task.assignedAt){ 
          task.assignedAt = new Date();
        } else {
          task.status = TaskStatus.OPEN; 
          }
      }
    
      task.assignedUsers = users;
    }
    
    if (updateTaskDto.status && updateTaskDto.status !== task.status) {
      task.status = updateTaskDto.status;
        if (updateTaskDto.status === TaskStatus.CLOSED) {
            
            if (!task.completedAt) {
            task.completedAt = new Date();
            }
          }
    }
  if (updateTaskDto.dueDate && new Date(updateTaskDto.dueDate) < new Date()) {
    throw new BadRequestException('Cannot set a due date in the past');
  }
  if (updateTaskDto.title === '') {
    throw new BadRequestException('Title cannot be empty');
  }
    
  Object.assign(task, {
      title: updateTaskDto.title ?? task.title,
      description: updateTaskDto.description ?? task.description,
      estimatedHours: updateTaskDto.estimatedHours ?? task.estimatedHours,
      cost: updateTaskDto.cost ?? task.cost,
      dueDate: updateTaskDto.dueDate ?? task.dueDate,
  });

    
  return await this.taskRepository.save(task);
  }


  async deleteTask(taskId: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException ('Task not found');
    }
    await this.taskRepository.remove(task);
  }




}