# Voting Dashboard

A secure electronic voting system for Eastern Railway's Secret Ballot Election 2024.

## Development with GitHub CodeSpaces

1. Click the "Code" button on GitHub
2. Select "Create codespace on main"
3. Wait for the environment to be created

The CodeSpace will automatically:
- Install dependencies
- Setup PostgreSQL
- Create the database
- Run migrations
- Start the development server

## Local Development

1. Clone the repository
```bash
git clone https://github.com/your-username/voting-dashboard.git
cd voting-dashboard
```

2. Copy environment file
```bash
cp .env.example .env
```

3. Install dependencies
```bash
npm install
```

4. Setup database
```bash
npm run migrate
```

5. Start development server
```bash
npm run dev
```

## Project Structure

```
├── .devcontainer/          # CodeSpaces configuration
├── scripts/                # Setup and utility scripts
├── server/                 # Backend server code
│   ├── controllers/        # Route controllers
│   ├── db/                # Database setup and migrations
│   ├── middleware/        # Express middleware
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── src/                   # Frontend source code
│   ├── components/       # React components
│   ├── store/           # State management
│   └── types/           # TypeScript types
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run migrate` - Run database migrations
- `npm run setup` - Initial setup (install + migrate)
- `npm run codespace:init` - Initialize CodeSpace environment