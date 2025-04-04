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

---

## Project Structure
```learnlaby/
│── .next/                 # Next.js build directory  
│── app/                   # Main application folder  
│   ├── api/               # API routes  
│   ├── calendar/          # Calendar feature  
│   ├── classroom/         # Classroom pages  
│   ├── components/        # UI components  
│   ├── home/              # Home page  
│   ├── profile/           # User profile  
│   ├── to-do/             # To-do feature  
│   ├── layout.tsx         # Main layout  
│   ├── page.tsx           # Entry point  
│── components/            # Shared components  
│── hooks/                 # Custom hooks  
│── lib/                   # Utility functions  
│── prisma/                # Prisma database schema  
│── public/                # Static assets  
│── .env                   # Environment variables  
│── package.json           # Dependencies and scripts  
│── next.config.ts         # Next.js configuration  
│── middleware.ts          # Middleware  
│── eslint.config.mjs      # ESLint config  
│── pnpm-lock.yaml         # pnpm lockfile
```

---

## Logging
- Client-side Logging:
Use ``console.log()`` for debugging UI components.

- Server-side Logging:
Use ``console.error()``, or integrate logging libraries such as Winston or Pino.

---

## Team Members
6510545250	Kongkawee Chayarat <br>
6510545322	Chayakarn Hengsuwan <br>
6510545454	Thorung Boonkaew <br>

