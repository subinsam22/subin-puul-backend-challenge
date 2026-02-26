
# Task Management API - Puul Backend Challenge

This is a RESTful API built with **NestJS**, **TypeORM**, and **PostgreSQL**. It handles task management, user performance tracking, and administrative analytics.

---

##  Features


- **Task Management:** Create, update, and filter tasks by date, user, and name.
- **Analytics:** Admin-only dashboard for cost tracking and task completion rates.


---
## Tech Stack
- **Framework:** NestJS (NodeJS)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Documentation:** Swagger (OpenAPI)

##  Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/puul-backend-challenge.git

```


## 🛠 Option 1: Running with Docker (Recommended)

This is the fastest way to get the environment running with a containerized database.

### 1. Prerequisites

- Docker and Docker Compose installed.


### 2. Setup Environment

Create a `.env` file in the root directory:

```env
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password123
DATABASE_NAME=puul_db
```


### 3. Launch
# Install dependencies
```
npm install node typeorm pg cache-manager


npm install @nestjs/typeorm @nestjs/config @nestjs/throttler @nestjs/cache-manager
```
```bash
docker-compose up --build
```

The API will be live at: **http://localhost:3000**

---

##  Option 2: Running Locally

Use this method if you prefer running the NestJS server on your host machine.

### 1. Prerequisites

- Node.js (v24 or higher)
- PostgreSQL running locally


### 2. Setup Environment

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=puul_db
```


### 3. Installation \& Run

```bash
# Install dependencies
npm install node typeorm pg cache-manager throttler-storage


npm install @nestjs/typeorm @nestjs/config @nestjs/throttler @nestjs/cache-manager
# Run in development mode
npm run start:dev
```


---

## 📖 API Documentation

Once the app is running, access the Swagger UI for interactive testing and endpoint exploration:

🔗 **http://localhost:3000/api**

For details info open api-documentation.md in root folder

---

## 💡 Configuration Tips

| Environment | DB_HOST Value | Reason |
| :-- | :-- | :-- |
| Docker | `db` | Matches the service name defined in `docker-compose.yml`. |
| Local | `localhost` | Points to the database service running on your local OS. |

```
