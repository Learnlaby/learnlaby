# Learnlaby Installation Guide

## Prerequisites

### Required Tools
- **Node.js (v16 or later recommended)**  
- **Git**
- **pnpm** 
- **PostgreSQL / Neon / Vercel Postgres**  

## Environment Setup

### 1. Clone the Repository
``
git clone https://github.com/your-username/learnlaby.git
cd learnlaby``

### 2. Install Dependencies 
Run the following:

``pnpm install``

### 3. Set Up Environment Variables
Create a .env file in the project root (same level as package.json). Copy and paste the environment variables from the snippet you provided (adjusting the values as needed):
[sample.env](https://github.com/Learnlaby/learnlaby/blob/main/sample.env)
> **Important:** Do not commit your .env file to version control. It should remain private.

### 4. Generate Prisma client
``npx prisma generate``


## Development
Run the development server:
``pnpm dev``
The application will be available at http://localhost:3000/
