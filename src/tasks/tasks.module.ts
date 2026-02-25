import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasks } from './task.entity';

import { User } from 'src/users/user.entity';

import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[
      TypeOrmModule.forFeature([Tasks,User]),
      UsersModule,
    ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
