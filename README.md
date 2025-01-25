# Questions & Answers

A questionnaire application built with Next.js that allows users to create and answer questions.

## Tech Stack

- **Framework:** [Next.js 15.1](https://nextjs.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [HeroUI](https://heroui.com/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Runtime:** [React 19](https://react.dev/)

## Features

- 📝 Create and manage questionnaires
- 💾 Persistent storage with PostgreSQL
- 📱 Responsive design
- ⚡ Fast page loads with Next.js
- 🎨 Modern UI with Tailwind CSS and HeroUI
- 🎬 Smooth animations with Framer Motion
- 📝 Type-safe development with TypeScript and Zod

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

4. Seed the database with sample data:
```bash
npm run seed
```

5. Run the development server:
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
- `npm run seed` - Populate database with sample quiz questions

## Database Management

This project uses PostgreSQL with Drizzle ORM for database management. The schema can be visualized using the DBML generator tool.

### Sample Data
Running `npm run seed` will populate your database with:
- 10 quiz questions across various categories (capitals, companies, historical events)
- Each question includes 1 correct answer and 2 wrong answers
- Answers are randomly shuffled for each question

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.MD) for details on how to:

- Submit issues using our [issue template](.github/ISSUE_TEMPLATE.md)
- Create pull requests following our [Git Flow](docs/CONTRIBUTING.MD#git-flow)
- Set up your development environment
- Follow our [conventional commits](docs/CONTRIBUTING.MD#conventional-commits) standard

## License

This project is open source and available under the MIT License.
