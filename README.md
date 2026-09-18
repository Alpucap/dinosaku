# Dinosaku: AI-Powered Financial Literacy Platform for Early Childhood Education

[![Live Demo](https://img.shields.io/badge/Live%20Demo-dinosaku.vercel.app-success?style=for-the-badge&logo=vercel)](https://dinosaku.vercel.app/)

Dinosaku is an interactive, gamified financial literacy platform tailored for early childhood and elementary education. By leveraging Google's Generative AI (Gemini), the platform delivers a personalized learning experience through dynamically generated stories, interactive quizzes, and assignment tracking. The application serves a dual-sided architecture: an engaging interface for children and a comprehensive analytical dashboard for guardians (parents and educators).

## Table of Contents
- System Architecture & Core Features
- Business Model & Monetization Strategy
- User Roles and Demo Credentials
- Technology Stack and Third-Party Resources
- Installation and Configuration Guide
- Application Workflows (User Guide)
- Credits and Acknowledgements
- License

## System Architecture & Core Features

- **Gamified Adventure Map**: A structured curriculum topology where children navigate through different thematic chapters and quizzes focused on core financial concepts (e.g., saving, spending, earning).
- **Generative AI Integration**: Utilizes the Google Gemini API to instantly generate personalized comic scripts and interactive quizzes based on selected themes (e.g., Astronauts, Under the Sea).
- **AI Image Generation**: Employs Google's Gemini Image Generation models to visually render character illustrations in real-time, bringing the educational stories to life.
- **Guardian Analytics Dashboard**: A centralized portal designed for both parents (B2C) and teachers (B2B) to monitor learning progress, track points, and oversee real-world saving goals.
- **Dynamic Assignment System**: Enables educators to deploy "Special Missions" (custom AI learning paths) to specific students or entire classrooms simultaneously.
- **Gamification Engine**: A comprehensive engagement loop featuring streaks, point accumulation, and unlockable badges to ensure high retention rates among children.

## Business Model & Monetization Strategy

To ensure sustainable operations and cover the overhead costs of AI inference, Dinosaku operates as a tiered Software-as-a-Service (SaaS) with hybrid monetization logic:
1. **B2C Premium Tier (Parents)**: Designed for families. Unlocks complete tracking capabilities, detailed AI learning reports, and increased monthly API token allowances (energy) per child.
2. **B2B Classroom & Enterprise Tier (Schools/Educators)**: Enables educators to bulk-license student accounts, unlocking access to classroom-wide analytics, multi-class dashboard support, and synchronous curriculum deployment capabilities.
3. **Pay-as-you-go Micro-transactions**: A top-up energy system allowing users to seamlessly purchase extra AI usage tokens on demand when their monthly baseline quota has been depleted.

## User Roles and Demo Credentials

The platform is pre-seeded with dummy accounts for immediate testing. Authentication bypasses standard password validation for the demo environment; users simply need to select a profile from the login interface.

**1. Student / Child Profile**
- **Username:** `bagas_s`
- **Full Name:** Bagas Santoso
- **Capabilities:** Access the Adventure Map, read AI-generated stories, complete quizzes, view unlocked badges, and execute Special Missions assigned by a teacher.

**2. Educator / Teacher Profile**
- **Username:** `bu_siti`
- **Full Name:** Siti Aminah, S.Pd
- **Capabilities:** Access the Guardian Dashboard. View the class leaderboard, manage multiple classrooms (Multi-Class Support), track student progress, and assign new learning topics via the Assignment menu.

**3. Parent Profile**
- **Username:** `budi_ortu`
- **Full Name:** Budi Santoso
- **Capabilities:** Access the Guardian Dashboard isolated to linked child accounts. Monitor real-world Saving Goal progress, view chronological learning timelines, and manage subscription tiers.

## Technology Stack and Third-Party Resources

- **Core Framework**: [Next.js 15](https://nextjs.org/) (React, App Router architecture)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database Provider**: PostgreSQL (Hosted via [Neon](https://neon.tech/))
- **File Storage**: Firebase Storage (Utilized for archiving AI-generated story images and media assets)
- **Artificial Intelligence**: Google Gemini API (Text and Image Generation)
- **Styling UI**: Tailwind CSS, Shadcn UI
- **Iconography**: Lucide React

## Installation and Configuration Guide

### Prerequisites
- Node.js v18.0.0 or higher
- A PostgreSQL database instance
- A Google AI Studio API Key (Gemini)
- A Firebase Project (with Storage enabled and Admin SDK credentials)

### 1. Clone the Repository
```bash
git clone https://github.com/Alpucap/dinosaku.git
cd dinosaku
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and define the following variables:

```env
# Database Connection (Neon, Supabase, or Local PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/db_name?sslmode=require"

# Google Generative AI (Gemini) API Key
GEMINI_API_KEY="AIzaSy..."

# Firebase Admin SDK Configuration (Required for image storage)
# Obtain from Firebase Console -> Project Settings -> Service Accounts
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
```

### 4. Database Initialization
Synchronize the Prisma schema with your PostgreSQL instance to generate the necessary tables:
```bash
npx prisma db push
```
*(Optional)* Seed the database with the provided dummy accounts:
```bash
npx prisma db seed
```

### 5. Start the Development Server
```bash
npm run dev
```
The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Application Workflows (User Guide)

### Core Learning Loop (Student)
1. Navigate to `/login` and select the **Bagas Santoso** profile.
2. The user will be redirected to the Adventure Map (`/learn`).
3. If a Special Mission has been assigned by an educator, a priority banner will appear. Selecting "Start Mission" triggers the AI to generate a custom story.
4. Alternatively, select any unlocked node on the map, read the educational narrative, and complete the concluding quiz to earn gamification points.

### Assignment Deployment (Educator)
1. Navigate to `/login` and select the **Siti Aminah** profile.
2. The user will be directed to the Guardian Dashboard.
3. Access the **"Penugasan"** (Assignments) module from the sidebar.
4. Complete the mission form: Select a target student or classroom, specify a financial topic (e.g., Savings, Needs vs Wants), and define a creative theme (e.g., Space Exploration).
5. The assignment status will remain "Pending" until the student successfully completes the generated module.

### Progress Monitoring (Parent)
1. Navigate to `/login` and select the **Budi Santoso** profile.
2. Access the **"Target Tabungan"** (Savings Goal) module from the sidebar.
3. Monitor the visual progress of the child's real-world saving objectives.
4. Access the **"Progres Belajar"** module to review a detailed, chronological ledger of completed stories and quiz performance metrics.

## Future Roadmap
While the current MVP successfully validates the core concept of AI-generated educational stories, our future milestones include:
- **Audio & Voice Narrative**: Integrating Google Cloud Text-to-Speech (TTS) API to narrate the AI stories aloud, assisting early-age children who are still learning to read.
- **Real Bank Integration**: Establishing an open-banking API connection to track real-world pocket money balances alongside virtual gamification points.
- **Comprehensive SaaS Monetization**: Full deployment of the subscription payment gateway (B2B and B2C tiers) via Midtrans/Xendit to support scalable AI token expenditures.
- **Multilingual Support**: Allowing the Gemini models to seamlessly transition the UI and story output into local dialects and foreign languages for broader accessibility.

## Credits and Acknowledgements
Dinosaku was developed with an emphasis on creating a safe, educational, and engaging digital environment for children. The platform extensively utilizes Google's Gemini LLMs to maintain a dynamic and personalized content pipeline without requiring manual content authoring. All third-party libraries, UI components, and APIs used remain the property of their respective creators.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
