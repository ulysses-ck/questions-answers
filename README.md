# Questions & Answers

A questionnaire application built with Next.js that allows users to create and answer questions.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [HeroUI](https://heroui.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)

## Features

- 📝 Create and manage questionnaires
- 💾 Persistent storage with PostgreSQL
- 📱 Responsive design
- ⚡ Fast page loads with Next.js
- 🎨 Modern UI with Tailwind CSS and HeroUI
- 🎬 Smooth animations with Framer Motion
- 📝 Type-safe development with TypeScript

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd questions-answers
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```
Fill in your PostgreSQL database connection details and other required variables.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
├── db/              # Database schema and configurations
└── lib/             # Utility functions and configurations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code linting
- `npm run dbml` - Generate DBML documentation

## Database Management

This project uses PostgreSQL with Drizzle ORM for database management. The schema can be visualized using the DBML generator tool.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is open source and available under the MIT License.
