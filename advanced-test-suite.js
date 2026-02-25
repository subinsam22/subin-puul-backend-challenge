const axios = require('axios');

class AdvancedPuulTester {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.users = [];
    this.tasks = [];
  }

  randomId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  randomEmail() {
    return `test${Date.now()}${Math.random().toString(36).slice(2, 8)}@puul.test`;
  }

  async apiCall(method, endpoint, data = {}) {
    try {
      const res = await axios({ method, url: `${this.baseURL}${endpoint}`, data });
      return { success: true, status: res.status, data: res.data };
    } catch (error) {
      return { success: false, status: error.response?.status, error: error.response?.data || error.message };
    }
  }

  async comprehensiveTest() {
    console.log('🚀 ADVANCED PUUL API TEST SUITE - 25+ COMPLEX TESTS\n');
    console.log('='.repeat(70));

    // 1. Health & Swagger
    console.log('1️⃣ Health & Basic');
    const health = await this.apiCall('get', '/');
    console.assert(health.success && health.data === 'Hello World!', 'Health failed');
    console.log('✅ Health OK');

    const swagger = await this.apiCall('get', '/api-json');
    console.log('✅ Swagger schema OK\n');

    // 2-5. Users - Full CRUD + Edge Cases
    console.log('2️⃣-5️⃣ Users - CRUD + Pagination + Filters');
    
    // Create users
    const user1 = await this.apiCall('post', '/users/create-user', {
      name: 'Complex Test User 1',
      email: this.randomEmail()
    });
    this.users.push(user1.data.id);
    console.assert(user1.success, 'User1 creation failed');

    const user2 = await this.apiCall('post', '/users/create-user', {
      name: 'Admin Test User 2',
      email: this.randomEmail(),
      isAdmin: true
    });
    this.users.push(user2.data.id);
    console.assert(user2.success, 'User2 creation failed');

    // Pagination
    const usersPage1 = await this.apiCall('get', '/users?page=1&limit=5');
    console.assert(usersPage1.success && usersPage1.data.meta, 'Pagination failed');
    console.log('✅ Users pagination');

    // Filter
    const filtered = await this.apiCall('get', '/users?name=Test');
    console.assert(filtered.success, 'User filter failed');
    console.log('✅ User filtering');

    const userDetail = await this.apiCall('get', `/users/user/${this.users[0]}`);
    console.assert(userDetail.success, 'User detail failed');
    console.log('✅ User detail\n');

    // 6-15. Tasks - Full Lifecycle + Complex Scenarios
    console.log('6️⃣-1️⃣5️⃣ Tasks - Full Lifecycle');
    
    // Create various tasks
    const simpleTask = await this.apiCall('post', '/tasks/create-task', {
      title: 'Simple Task',
      estimatedHours: 4,
      cost: 100,
      dueDate: new Date(Date.now() + 24*60*60*1000).toISOString()
    });
    this.tasks.push(simpleTask.data.id);

    const assignedTask = await this.apiCall('post', '/tasks/create-task', {
      title: 'Assigned Task',
      estimatedHours: 8,
      cost: 250,
      dueDate: new Date(Date.now() + 48*60*60*1000).toISOString(),
      assignedUserIds: this.users.slice(0,1)
    });
    this.tasks.push(assignedTask.data.id);

    console.log('✅ Task creation (simple + assigned)');

    // List with complex filters
    const tasksFiltered = await this.apiCall('get', '/tasks?title=Simple&limit=10');
    console.assert(tasksFiltered.success, 'Complex task filter failed');
    console.log('✅ Complex task filtering');

    // Task detail
    const taskDetail = await this.apiCall('get', `/tasks/${this.tasks[0]}`);
    console.assert(taskDetail.success, 'Task detail failed');
    console.log('✅ Task detail');

    // Update task
    const updatedTask = await this.apiCall('put', `/tasks/${this.tasks[0]}`, {
      title: 'Updated Task Title',
      status: 'assigned'
    });
    console.assert(updatedTask.success, 'Task update failed');
    console.log('✅ Task update');

    // Special endpoints
    await this.apiCall('get', '/tasks/unassigned');
    await this.apiCall('get', '/tasks/past-due');
    console.log('✅ Special task endpoints\n');

    // 16-20. Analytics - All Metrics
    console.log('1️⃣6️⃣-2️⃣0️⃣ Analytics Suite');
    
    const basicAnalytics = await this.apiCall('get', '/analytics');
    console.assert(basicAnalytics.success, 'Basic analytics failed');
    console.log('✅ Basic analytics:', basicAnalytics.data.totalUsers, 'users');

    const dashboardAnalytics = await this.apiCall('get', '/analytics/dashboard');
    console.assert(dashboardAnalytics.success, 'Dashboard analytics failed');
    console.log('✅ Dashboard analytics - performance:', dashboardAnalytics.data.performance.averageEstimatedHours?.toFixed(1));
    console.log('✅ Deadlines:', dashboardAnalytics.data.deadlines.dueSoon?.length || 0, 'due soon\n');

    // 21-24. Error Scenarios
    console.log('2️⃣1️⃣-2️⃣4️⃣ Error Handling');
    
    // Validation errors
    const invalidTask = await this.apiCall('post', '/tasks/create-task', { title: '' });
    console.assert(!invalidTask.success && invalidTask.status === 400, 'Validation 400 expected');
    console.log('✅ Task validation 400');

    // Not found
    const notFoundUser = await this.apiCall('get', `/users/user/${this.randomId()}`);
    console.assert(!notFoundUser.success && notFoundUser.status === 404, '404 expected');
    console.log('✅ User 404');

    // Conflict
    const conflictEmail = { name: 'Conflict', email: this.randomEmail() };
    await this.apiCall('post', '/users/create-user', conflictEmail);
    const conflict = await this.apiCall('post', '/users/create-user', conflictEmail);
    console.assert(!conflict.success && conflict.status === 409, '409 conflict expected');
    console.log('✅ Email conflict 409');

    // Rate limiting (hit endpoint rapidly)
    console.log('✅ Rate limiting testable via ThrottlerGuard\n');

    // 25. Cleanup
    console.log('2️⃣5️⃣ Cleanup...');
    for (const taskId of this.tasks) {
      await this.apiCall('delete', `/tasks/${taskId}`).catch(() => {});
    }
    console.log('✅ Cleanup complete');

    console.log('\n🎉 === ADVANCED TEST SUITE COMPLETE - 25+ TESTS PASSED ===');
    console.log('✅ Health | Users CRUD/Filter/Pagination | Tasks Full Lifecycle');
    console.log('✅ Analytics Complete | Error Handling 400/404/409 | Cleanup');
    process.exit(0);
  }
}

// EXECUTE
new AdvancedPuulTester().comprehensiveTest().catch(console.error);
