# Booking Platform API

## Project Overview

This repository contains the REST API for the Booking Platform, built using NestJS and PostgreSQL. The architecture is designed with a strict emphasis on clean code, pro-code programming practices, and maintainability. It features complete authentication, service management, and a robust booking engine that enforces strict business rules and prevents duplicate reservations.

## Installation Steps

1. Clone the repository:
   `git clone <your-repository-url>`
2. Navigate into the directory:
   `cd en2h-booking-api`
3. Install dependencies:
   `npm install`

## Environment Variables

Create a `.env` file in the root directory. An `.env.example` file is provided for reference.
Required variables include:

- `PORT=3000`
- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=your_password`
- `DB_NAME=booking_db`
- `JWT_SECRET=your_jwt_secret`
- `JWT_REFRESH_SECRET=your_refresh_secret`
- `JWT_EXPIRATION=15m`
- `JWT_REFRESH_EXPIRATION=7d`

## Database Setup

1. Ensure PostgreSQL is installed and running locally.
2. Create a new, empty database named `booking_db` (or match the name in your `.env` file).

## Running Migrations

To set up the database tables securely without auto-synchronization, run the initial migration:
`npx typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts`

## Running the Application

- Development mode: `npm run start:dev`
- Production build: `npm run build` followed by `npm run start:prod`
- Run Unit Tests: `npm run test`

## Running the Application with Docker
Alternatively, you can run the entire platform (API and PostgreSQL database) using Docker:
1. Build and start the containers:
   `docker-compose up --build`
2. Run database migrations inside the running API container:
   `docker-compose exec api npx typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts`
3. Access the API at **http://localhost:3000** and Swagger documentation at **http://localhost:3000/api/docs**.

## API Documentation

The API is fully documented using Swagger.
Once the application is running, navigate to:
**http://localhost:3000/api/docs**

From there, you can view all endpoints, expected DTO schemas, and test the endpoints directly. For protected routes, use the `/auth/login` endpoint to receive a JWT token, and apply it via the "Authorize" button at the top of the Swagger UI.

## Assumptions Made

- All prices are stored as decimals and managed in the primary currency of the platform.
- Booking times are stored in a standard 24-hour format (`HH:MM`) independent of deep timezone formatting for simplicity in the core booking logic.
- Customers do not need an account to make a booking, prioritizing a frictionless checkout experience.

## Future Improvements

- Integration with AWS for scalable, highly available cloud deployment.
- Implementing Redis for caching frequently accessed services to reduce database load.
- Integrating an email provider (like SendGrid) to send automatic confirmation emails upon booking creation and changes.
