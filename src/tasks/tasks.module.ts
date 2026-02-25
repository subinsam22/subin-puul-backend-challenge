import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasks } from './task.entity';

import { User } from 'src/users/user.entity';

@Module({
  imports:[
      TypeOrmModule.forFeature([Tasks,User]),
     
    ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
