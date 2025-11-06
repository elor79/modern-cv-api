# CV API Backend for Vercel

This is the serverless API backend for Eduard Lorenz's CV website, providing AI-powered chat functionality.

## Features

- AI Chat with Claude (Anthropic)
- RAG (Retrieval Augmented Generation) using full CV knowledge base
- Multilingual support (EN/DE/FR)
- CORS enabled for cross-origin requests

## Deployment to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. Create a new GitHub repository
2. Push this code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. Go to [vercel.com](https://vercel.com)
4. Click "New Project"
5. Import your GitHub repository
6. Add environment variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key
7. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

4. Add environment variable via Vercel dashboard or CLI:
   ```bash
   vercel env add ANTHROPIC_API_KEY
   ```

## Environment Variables

Required:
- `ANTHROPIC_API_KEY` - Your Anthropic API key

## API Endpoints

### POST /api/chat

Chat with the AI assistant about Eduard's CV.

**Request:**
```json
{
  "message": "What are Eduard's main skills?",
  "language": "en",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "response": "Eduard has extensive experience in...",
  "conversationHistory": [...]
}
```

## Current Deployment

**Live API URL**: `https://modern-cv-api.vercel.app`

**API Endpoint**: `https://modern-cv-api.vercel.app/api/chat`

This API is currently integrated with:
- **Frontend**: [modern-cv-system](https://github.com/elor79/modern-cv-system)
- **Admin System**: [enhanced-cv-system](https://github.com/elor79/enhanced-cv-system)

## Configuration

### Claude AI Model
Currently using: `claude-3-haiku-20240307`

To upgrade to a different model, edit `api/chat.js`:
```javascript
model: 'claude-3-haiku-20240307',  // Change this
```

Available models (check your Anthropic plan):
- `claude-3-haiku-20240307` - Fast, cost-effective
- `claude-3-sonnet-20240229` - Balanced performance
- `claude-3-5-sonnet-20241022` - Most capable (requires appropriate plan)

### Knowledge Base
The CV data is stored in `/data/knowledge-base.json` and includes:
- Personal information
- Work experience
- Skills and expertise
- Portfolio projects
- Testimonials
- Education

To update the knowledge base, edit `data/knowledge-base.json` and redeploy.
