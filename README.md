# Vesty UI Proto

A Next.js application featuring LaTeX rendering and transcript processing capabilities.

## Features

- Real-time LaTeX rendering using KaTeX
- Transcript processing with timecode support
- Chat interface with AI integration
- Floating video player with controls
- Backend transcript processing tools

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. For transcript processing:
```bash
cd backend
python transcript.py
```

## Project Structure

- `src/app` - Next.js pages and API routes
- `src/components` - React components
- `src/lib` - Utilities and contexts
- `backend` - Python scripts for transcript processing

## Technologies Used

- Next.js 14
- React
- TypeScript
- KaTeX
- Python (for transcript processing)
- Tailwind CSS