import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks, TaskStatus } from 'src/tasks/task.entity';
import { User } from 'src/users/user.entity';
import { In, LessThan, Repository } from 'typeorm';
import { CombinedAnalyticsDto, TaskDeadlineDetailDto } from './dto/detailedWorkDue.dto';


@Injectable()
export class AnalyticsService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tasks)
    private readonly taskRepository: Repository<Tasks>
  ) {}


  async getAnalytics() {
    const totalUsers = await this.userRepository.count();
    const totalTasks = await this.taskRepository.count();
    const completedTasks = await this.taskRepository.count({ where: { status: TaskStatus.CLOSED } });
    const pendingTasks = await this.taskRepository.count({ where: { status: TaskStatus.ASSIGNED} });
    const overdueTasks = await this.taskRepository.count({ where: { dueDate: LessThan(new Date()), status: In([TaskStatus.ASSIGNED]) } });

    const unassignedTasks = await this.taskRepository.createQueryBuilder('task').leftJoin('task.assignedUsers', 'user').where('user.id IS NULL').getCount();


    return {
      totalUsers,
      totalTasks,
      completedTasks,
      pendingTasks,
      unassignedTasks,
      overdueTasks
    };
  }

  async getDashboardAnalytics(): Promise<CombinedAnalyticsDto> {
  const now = new Date();
  const twentyFourHoursFromNow = new Date(now.getTime() + (24 * 60 * 60 * 1000));

  // 1. Fetch Tasks for Deadline Health
  const tasks = await this.taskRepository.createQueryBuilder('task')
    .leftJoinAndSelect('task.assignedUsers', 'user')
    .select(['task.id', 'task.title', 'task.dueDate', 'task.status', 'user.name', 'user.email'])
    .where('task.status NOT IN (:...excluded)', { excluded: [TaskStatus.CLOSED, TaskStatus.CANCELLED] })
    .andWhere('task.dueDate IS NOT NULL')
    .getMany();

  const deadlineStats: { 
  overdue: TaskDeadlineDetailDto[]; 
  dueSoon: TaskDeadlineDetailDto[]; 
  onTrackCount: number 
} = { 
  overdue: [], 
  dueSoon: [], 
  onTrackCount: 0 
};

tasks.forEach(task => {
  const dDate = new Date(task.dueDate);
  
  
  const taskDetail: TaskDeadlineDetailDto = {
    id: task.id,
    title: task.title,
    dueDate: task.dueDate,
    status: task.status,
    
    assignedUsers: (task.assignedUsers || []).map(user => ({
      name: user.name,
      email: user.email
    }))
  };

  if (dDate < now) {
    deadlineStats.overdue.push(taskDetail);
  } else if (dDate <= twentyFourHoursFromNow) {
    deadlineStats.dueSoon.push(taskDetail);
  } else {
    deadlineStats.onTrackCount++;
  }
});

  // 2. Fetch Performance & Estimation Stats
  const performanceRaw = await this.taskRepository.createQueryBuilder('task')
    .select('AVG(task.estimatedHours)', 'avgEst')
    .addSelect('AVG(EXTRACT(EPOCH FROM (task.completedAt - task.assignedAt)) / 3600)', 'avgAct')
    .where('task.status = :closed', { closed: TaskStatus.CLOSED })
    .andWhere('task.assignedAt IS NOT NULL AND task.completedAt IS NOT NULL')
    .getRawOne();

  const actual = parseFloat(performanceRaw.avgAct) || 0;
  const estimated = parseFloat(performanceRaw.avgEst) || 0;
  const variance = actual - estimated;

  return {
    deadlines: deadlineStats,
    performance: {
      averageEstimatedHours: Number(estimated.toFixed(2)),
      averageActualHours: Number(actual.toFixed(2)),
      averageVariance: Number(variance.toFixed(2)),
      accuracyPercentage: actual > 0 ? Number(((estimated / actual) * 100).toFixed(1)) : 0,
      insight: variance > 0 
        ? `Tasks are overrunning estimates by ${variance.toFixed(1)} hours.` 
        : `Tasks are finishing ${Math.abs(variance).toFixed(1)} hours ahead of schedule.`
    }
  };
}
  

  

}



