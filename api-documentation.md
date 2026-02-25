

# Puul Task Management API Documentation

**Version:** 1.0  
**Base URL:** `http://localhost:3000/api`  
**PostgreSQL + TypeORM + NestJS + Swagger**

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Users](#users)
- [Tasks](#tasks)
- [Analytics](#analytics)
- [Pagination](#pagination)

## Overview
Task management API for teams with user assignment, cost tracking, time estimation, and analytics. Features full CRUD operations with comprehensive filtering and pagination.
## Authentication
No authentication required (public API)

## Rate Limiting
- **10 requests per minute per IP** via ThrottlerGuard

---

## Users

### Get All Users
`GET /users`

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |
| `name` | string | Filter by name (partial match) |
| `email` | string | Filter by email (partial match) |
| `role` | enum | Filter by role: `user`, `admin` |

**Response:** `200 OK` Paginated users with completed task metrics
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "completedTasksCount": 5,
      "totalCompletedCost": 1500.50
    }
  ],
  "meta": {
    "currentPage": 1,
    "itemsperPage": 10,
    "totalItems": 25,
    "totalPages": 3,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```


### Create User

`POST /users/create-user`

**Body:**


| Field | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `name` | string | ✅ | 2-255 chars |
| `email` | string | ✅ | Valid email format |
| `isAdmin` | boolean | ❌ | Default: false |

**Response:** `201 Created`

```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2026-02-24T20:46:00.000Z"
}
```


### Get User by ID

`GET /users/user/:userId`

**Response:** `200 OK` Full user with assigned tasks

---

## Tasks

### Get All Tasks

`GET /tasks`

**Query Parameters:**


| Param | Type | Description |
| :-- | :-- | :-- |
| `page` | number | Page number |
| `limit` | number | Items per page |
| `title` | string | Partial title match |
| `user_email` | string | Filter by assigned user email |
| `assignedUserIds` | string[] | Filter by user UUIDs |
| `dueDate` | date | Exact date match (YYYY-MM-DD) |
| `status` | enum | `open`, `assigned`, `closed`, `cancelled` |

**Response:** `200 OK` Paginated tasks with assigned users

### Create Task

`POST /tasks/create-task`

**Body:**


| Field | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `title` | string | ✅ | 1-255 chars |
| `description` | string | ❌ | Min 10 chars |
| `estimatedHours` | number | ✅ | 0-2000 hours |
| `cost` | number | ✅ | 0-99,999,999 |
| `dueDate` | string | ✅ | ISO 8601, future date only |
| `assignedUserIds` | string[] | ❌ | Valid UUIDs |

**Response:** `201 Created` New task object

### Get Task by ID

`GET /tasks/:id`

**Response:** `200 OK` Task with assigned users

### Update Task

`PUT /tasks/:id`

**Body:** Same as CreateTaskDto (all optional)

### Delete Task

`DELETE /tasks/:id`

**Response:** `204 No Content`

### Get Unassigned Tasks

`GET /tasks/unassigned`

**Response:** `200 OK` Tasks with no assigned users

### Get Past Due Tasks

`GET /tasks/past-due`

**Response:** `200 OK` Overdue open/assigned tasks

### Get User Tasks

`GET /tasks/user/:userEmail`

**Response:** `200 OK` User with their assigned tasks

---

## Analytics

### Get Basic Analytics

`GET /analytics`

**Response:** `200 OK`

```json
{
  "totalUsers": 25,
  "totalTasks": 150,
  "completedTasks": 75,
  "pendingTasks": 50,
  "unassignedTasks": 10,
  "overdueTasks": 15
}
```


### Get Dashboard Analytics

`GET /analytics/dashboard`
## The End point will return two analytics behaviour 1)(list of overdue and due soon and also number of On Track) 2)Actual time taken Vs Estimated Hour assigned for the job
**Response:** `200 OK`

```json
{
  "deadlines": {
    "overdue": [...],
    "dueSoon": [...],
    "onTrackCount": 45
  },
  "performance": {
    "averageEstimatedHours": 8.5,
    "averageActualHours": 9.2,
    "accuracyPercentage": 92.4,
    "averageVariance": 0.7,
    "insight": "Tasks are overrunning estimates by 0.7 hours."
  }
}
```


## Error Responses

All endpoints return standard HTTP status codes with JSON error messages:

- `400 Bad Request` - Validation errors
- `404 Not Found` - Resource not found
- `409 Conflict` - Email already exists
- `429 Too Many Requests` - Rate limit exceeded


## Running the API

```bash
npm run start:dev
# Visit http://localhost:3000/api for Swagger UI for testing 
# Import from http://localhost:3000/api-json in Postman for testing if needed
```



```


