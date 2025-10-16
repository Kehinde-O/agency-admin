# Agency Admin Dashboard

A modern, responsive admin dashboard built with Next.js 14, TypeScript, and Tailwind CSS for managing the Agency property management system.

## Features

- 🔐 **Secure Admin Authentication** - Admin-only access with credential validation
- 📊 **Dashboard Overview** - Real-time statistics and activity monitoring
- 👥 **User Management** - Manage users, agents, and permissions
- 🏠 **Property Management** - Oversee property listings and approvals
- 📈 **Reports & Analytics** - Comprehensive reporting and insights
- ⚙️ **System Settings** - Configure application settings
- 📱 **Responsive Design** - Optimized for desktop and tablet use
- 🎨 **Modern UI/UX** - Clean, professional interface matching agency branding

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Local storage-based (demo)
- **State Management**: React hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the admin-app directory:
```bash
cd admin-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials

For testing purposes, use these credentials:
- **Email**: admin@agency.com
- **Password**: admin123

## Project Structure

```
admin-app/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Login page
│   ├── components/         # Reusable components
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript definitions
├── public/                # Static assets
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## Features Overview

### Authentication System
- Secure admin-only login
- Session management with localStorage
- Automatic redirect for unauthenticated users
- Demo credentials for testing

### Dashboard
- Real-time statistics display
- Activity feed with recent actions
- Responsive grid layout
- Interactive navigation

### Design System
- Consistent color palette matching agency branding
- Modern glassmorphism and gradient effects
- Accessible form controls and interactions
- Professional typography with Inter font

## Customization

### Colors
The admin dashboard uses a custom color palette defined in `tailwind.config.js`:
- Primary: Purple gradient (#6c5ce7)
- Accent: Orange (#fd9644)
- Background: Light gray (#f5f7fa)
- Text: Dark gray (#2d3436)

### Adding New Pages
1. Create a new directory in `src/app/`
2. Add a `page.tsx` file
3. Update the sidebar navigation in `dashboard/page.tsx`

## Security Notes

⚠️ **Important**: This is a demo implementation using localStorage for authentication. In production, implement:
- JWT tokens with secure storage
- Backend API authentication
- Role-based access control
- Session timeout handling
- CSRF protection

## Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables
Create a `.env.local` file for production configuration:
```
NEXT_PUBLIC_API_URL=your_backend_url
NEXT_PUBLIC_ADMIN_EMAIL=admin@agency.com
```

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new files
3. Add proper error handling
4. Test responsive design
5. Update documentation

## License

© 2024 Agency Admin Dashboard. All rights reserved.
# Environment Variables

This admin app uses environment variables for configuration. Copy  to  and update the values as needed.

## Required Environment Variables

- : The backend API URL (default: https://agency-backend-pi.vercel.app/api/v1)

## Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the values in  as needed for your environment.

3. Restart the development server after making changes to environment variables.

## Production

Make sure to set the environment variables in your production environment (Vercel, Netlify, etc.) with the correct backend URL.


# Environment Variables

This admin app uses environment variables for configuration. Copy `.env.example` to `.env` and update the values as needed.

## Required Environment Variables

- `NEXT_PUBLIC_API_URL`: The backend API URL (default: https://agency-backend-pi.vercel.app/api/v1)

## Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the values in `.env` as needed for your environment.

3. Restart the development server after making changes to environment variables.

## Production

Make sure to set the environment variables in your production environment (Vercel, Netlify, etc.) with the correct backend URL.
