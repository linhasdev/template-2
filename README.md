# Vesty UI Proto

A Next.js application featuring LaTeX rendering and transcript processing capabilities.

Features

Real-time LaTeX rendering using KaTeX

Transcript processing with timecode support

Chat interface with AI integration

Floating video player with controls

Backend transcript processing tools

Setup

1. Install Dependencies

npm install

2. Set Up Environment Variables

Create a .env.local file in the project root and add the required environment variables:

OPENAI_API_KEY=your_openai_api_key_here

Replace your_openai_api_key_here with your actual OpenAI API key.

3. Run the Development Server

npm run dev

4. Run Transcript Processing (Optional)

For transcript processing, navigate to the backend directory and execute:

cd backend
python transcript.py

Project Structure

src/app - Next.js pages and API routes

src/components - React components

src/lib - Utilities and contexts

backend - Python scripts for transcript processing

Technologies Used

Next.js 14

React

TypeScript

KaTeX

Python (for transcript processing)

Tailwind CSS

