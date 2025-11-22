# Farmer Backend API

## Features
- User (Farmer) management (register, login, profile)
- Money management (income, expenses, balance)
- Crop disease & weed identification (proxy to your ML APIs)
- Weather-based nutrition/water suggestions
- B2B crop selling (listings, inquiries)
- Farming suggestions (proxy to your ML API)
- Live market rates by locality

## Tech Stack
- Node.js, Express, MongoDB

## Getting Started
1. Install dependencies:
   ```
   npm install
   ```
2. Set up your `.env` file (see `.env` for example).
3. Start the server:
   ```
   npm run dev
   ```

## API Structure
- `/api/auth` – Auth routes
- `/api/money` – Money management
- `/api/crop` – Crop listing, selling
- `/api/disease` – Disease identification (proxy)
- `/api/weed` – Weed identification (proxy)
- `/api/suggestion` – Farming suggestions (proxy)
- `/api/weather` – Weather-based advice
- `/api/market` – Market rates

## Note
- Endpoints for disease, weed, and farming suggestions are placeholders for your trained APIs.
- Weather and market endpoints can be linked to external APIs as needed.
