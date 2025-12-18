# TaskPilot

AI-powered todo app that helps you find your ONE Thing.

## Concept

TaskPilot is a productivity tool with an AI "Chief of Staff" that helps you identify and focus on your single most important task each day. Inspired by "The ONE Thing" philosophy.

### Features

- **Morning Briefing**: AI-guided session to identify your ONE Thing
- **Focus Protection**: Alerts when your task load threatens focus
- **Daily Review**: End-of-day reflection and pattern recognition

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma
- **AI**: Claude API (Anthropic)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/eberhardgg/taskpilot.git
cd taskpilot

# Install dependencies
npm install

# Set up the database
npx prisma migrate dev

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Create a `.env.local` file:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/ui/       # Shared UI components
├── features/
│   ├── tasks/          # Task management feature
│   └── ai/             # AI briefing feature
├── lib/                # Utilities (db client, etc.)
└── generated/          # Prisma client (gitignored)
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

MIT
