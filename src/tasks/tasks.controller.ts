import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';
import { ApiOperation,  ApiResponse, ApiTags } from '@nestjs/swagger';
import { Tasks } from './task.entity';


import { PaginatedResponse } from 'src/common/pagination/paginated-response.interface';
import { FilterTaskQueryDto } from './dto/fillter-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The task has been successfully created.' })
  @Post('create-task')
  async createTask(@Body() createTaskDto:CreateTaskDto) :Promise<Tasks> {
    return this.tasksService.createTask(createTaskDto);
  }

 

  @ApiOperation({ summary: 'Get unassigned tasks' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved unassigned tasks.' })
  @Get('unassigned')
  async getUnassignedTasks() {
    return this.tasksService.unassignedTasks();
  }

  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved all tasks.' })
  @Get()
  async getAllTasks(@Query() query:FilterTaskQueryDto) :Promise<PaginatedResponse<Tasks>> {
    return this.tasksService.findAll(query);
  }

  @ApiOperation({ summary: 'Get tasks for a specific user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved tasks for the user.' })
  @Get('user/:userEmail')
  async getTasksByUserId(@Param('userEmail') userEmail: string) {
    return this.tasksService.findTasksByUserEmail(userEmail);
  }

  @ApiOperation({ summary: 'Get past due tasks' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved past due tasks.' })
  @Get('past-due')
  async getPastDueTasks() {
    return this.tasksService.findTaskPastDueDate();
  }

  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved the specific task.' })
  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    return this.tasksService.findTaskById(id);
  }

  @ApiOperation({ summary: 'Update tasks' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully updated tasks.' })
  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Tasks> {
    return this.tasksService.update_task(id, updateTaskDto);
  }

  @ApiOperation({ summary: 'Delete tasks' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Successfully deleted tasks.' })
  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }

}
