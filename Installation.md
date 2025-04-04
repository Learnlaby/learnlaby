# Learnlaby Installation Guide

---

## Prerequisites

### Required Tools
- **Node.js (v16 or later recommended)**  
  - [Download and Install Node.js](https://nodejs.org/)
- **Git**
  - [Download and Install Git](https://git-scm.com/downloads)
- **pnpm** – Install with:
```npm install -g pnpm```
- **PostgreSQL / Neon / Vercel Postgres**  
  - [Neon](https://neon.tech/) or [Vercel Postgres](https://vercel.com/postgres)

---

## Environment Setup

### 1. Clone the Repository
``
git clone https://github.com/your-username/learnlaby.git
cd learnlaby``

### 2. Install Dependencies 
Run either of the following:

``
npm install
pnpm install``

### 3. Set Up Environment Variables
Create a .env file in the project root (same level as package.json). Copy and paste the environment variables from the snippet you provided (adjusting the values as needed):
[sample.env](https://github.com/Learnlaby/learnlaby/blob/main/sample.env)
> **Important:** Do not commit your .env file to version control. It should remain private.

### 4. Generate Prisma client
``pnpm prisma generate``

---

## Development
Run the development server:
``pnpm dev``
The application will be available at http://localhost:3000/.

---

## Testing ** (wip)
- Linting:
``pnpm lint``
- Run tests:
``pnpm test``
