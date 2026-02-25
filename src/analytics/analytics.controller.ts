import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {

  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: 'Get analytics data for all tasks' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved all analytics data for all tasks' })
  @Get()
  async getAnalytics() {
    return this.analyticsService.getAnalytics();
  }

  @ApiOperation({ summary: 'Get combined analytics data for dashboard' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved combined analytics data for dashboard' })
  @Get('dashboard')
  async getDashboardAnalytics() {
    return this.analyticsService.getDashboardAnalytics();
  }
}
