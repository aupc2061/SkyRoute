# SkyRoute - Airline Management Website

A modern, full-stack web application for managing airline operations and bookings. Built with Next.js, TypeScript, and Tailwind CSS, SkyRoute offers a seamless and smooth experience for customers.

## Features

### Flight Management
- **Real-time Flight Tracking**: Monitor flight status, delays, and gate changes in real-time
- **Interactive Flight Search**: Advanced search functionality with filters for dates, destinations, and prices
- **Dynamic Pricing**: Automated price adjustments based on demand and seasonality

### Booking System
- **Secure Payment Processing**: Integrated with Stripe for safe and reliable payments
- **Multi-city Booking**: Support for complex itineraries with multiple stops
- **Flexible Booking Management**: Easy modification and cancellation of bookings

### User Features
- **User Authentication**: Secure login and registration with NextAuth.js
- **Flight Reviews & Ratings**: Community-driven feedback system for flights and services
- **Travel History**: Detailed records of past and upcoming flights

### AI Travel Assistant
- **Smart Recommendations**: AI-powered suggestions for flights based on user preferences
- **24/7 Support**: Automated assistance for common queries and issues

## Tech Stack

### Frontend
- **Next.js 14**: React framework for production-grade applications
- **TypeScript**: Enhanced code quality and developer experience
- **Tailwind CSS**: Utility-first CSS framework for modern designs
- **Shadcn UI**: High-quality UI components
- **React Query**: Efficient data fetching and cache management

### Backend
- **MongoDB**: NoSQL database for flexible data storage
- **NextAuth.js**: Authentication solution with multiple provider support
- **Node.js**: Runtime environment for server-side operations

### DevOps & Tools
- **Vercel**: Hosting and deployment platform
- **Git**: Version control and collaboration
- **ESLint & Prettier**: Code quality and formatting
- **Jest & React Testing Library**: Testing framework

## Live Demo

Visit our live application at:([https://skyroute.vercel.app](https://sky-route-nu.vercel.app/))

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/DarkKnight939/SkyRoute---Airline-Management-Website.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add the following variables:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
MONGODB_URI=your_mongodb_uri
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
