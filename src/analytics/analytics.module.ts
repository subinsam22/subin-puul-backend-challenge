import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasks } from 'src/tasks/task.entity';
import { User } from 'src/users/user.entity';

@Module({
   imports:[
        TypeOrmModule.forFeature([Tasks,User]),
       
      ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController]
})
export class AnalyticsModule {}
