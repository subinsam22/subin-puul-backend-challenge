import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { User } from './users/user.entity';
import { Tasks } from './tasks/task.entity';
import { ThrottlerModule } from '@nestjs/throttler/dist/throttler.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AnalyticsModule } from './analytics/analytics.module';
import { CacheModule } from '@nestjs/cache-manager';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load:[appConfig]
    }),
    TypeOrmModule.forRoot({
      
      type:'postgres',
      host:process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username:process.env.DATABASE_USER,
      password:process.env.DATABASE_PASSWORD,
      database:process.env.DATABASE_NAME,
      entities:[User,Tasks],
      synchronize:true ,
      // logging: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute (in milliseconds)
      limit: 100,  // Max 10 requests per minute per IP
    }]),
    CacheModule.register({
      ttl: 30000, // Cache duration in seconds
      max: 100, // Maximum number of items in cache
      isGlobal: true,
    }),
    
    UsersModule,
    TasksModule,
    AnalyticsModule
  ],
  controllers: [AppController],
  providers: [AppService,{ provide: APP_GUARD,useClass: ThrottlerGuard,},],
})
export class AppModule {}
