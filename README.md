# Number Discussions

A social network where people communicate through numbers. Start discussions with a number, respond with mathematical operations, and create collaborative calculation chains.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

- **Authentication**: Register and login with username/password
- **Start Discussions**: Post a starting number to begin a new thread
- **Respond with Math**: Reply using operations (+, −, ×, ÷)
- **Threaded View**: See calculation chains in a nested tree structure
- **Dark Mode**: Toggle between light, dark, and system themes
- **Real-time Feedback**: Toast notifications for all actions
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Forms**: react-hook-form
- **Notifications**: sonner
- **Icons**: @tabler/icons-react

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/AdhamMohamedSaleh/number-discussion-frontend.git
cd number-discussion-frontend

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (e.g., `https://your-api.railway.app/api`) | Yes |
| `NEXT_PUBLIC_SITE_URL` | Frontend URL for SEO metadata | No |

### For Vercel Deployment

Add these environment variables in your Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://number-discussion-backend-production.up.railway.app/api
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

## API Endpoints

The frontend connects to these backend endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |
| GET | `/api/calculations` | Get all calculations |
| GET | `/api/calculations/:id` | Get specific calculation tree |
| POST | `/api/calculations` | Create calculation (protected) |
| POST | `/api/calculations/:id/respond` | Respond to calculation (protected) |

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   ├── loading.tsx         # Loading state
│   ├── error.tsx           # Error boundary
│   ├── not-found.tsx       # 404 page
│   ├── robots.ts           # SEO robots.txt
│   └── sitemap.ts          # SEO sitemap
├── components/
│   ├── home-page.tsx       # Main application UI
│   ├── auth-form.tsx       # Login/Register form
│   ├── calculation-tree.tsx # Threaded discussion view
│   ├── create-calculation-form.tsx
│   ├── respond-form.tsx
│   ├── theme-toggle.tsx    # Dark mode toggle
│   ├── error-boundary.tsx  # Error handling
│   ├── skeleton.tsx        # Loading skeletons
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── api.ts              # API client with retry logic
│   ├── auth-context.tsx    # Authentication state
│   ├── theme-context.tsx   # Theme state
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
   - `NEXT_PUBLIC_SITE_URL`: Your Vercel app URL
4. Deploy

### Other Platforms

```bash
pnpm build
pnpm start
```

## License

MIT
