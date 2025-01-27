# TidyTab

A modern group payment splitting web app with real-time updates and fun analytics.

## Features

- Create expense-sharing circles with friends
- Real-time expense tracking and calculations
- Smart bill scanning with Google Vision API
- Fun spending insights powered by GPT-4
- Beautiful, responsive UI with animations

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: TailwindCSS
- Animations: Framer Motion
- Database: Firebase Firestore
- Authentication: Firebase Auth
- AI/ML: Google Vision API, OpenAI GPT-4

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/circlesplit.git
   cd circlesplit
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration values

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the app

## Project Structure

```
src/
├── components/     # Reusable UI components
├── config/        # Configuration files
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── pages/         # Page components
├── services/      # API and service functions
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
