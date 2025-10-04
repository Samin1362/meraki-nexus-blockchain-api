# MerakiNexus Payment Frontend

A modern React.js frontend for blockchain payments with MetaMask integration and API fallback, featuring a futuristic MerakiNexus theme with TailwindCSS and GSAP animations.

## 🚀 Features

- **MetaMask Integration**: Seamless wallet connection and direct transaction sending
- **API Fallback**: Automatic fallback to backend API when MetaMask is unavailable
- **Modern UI/UX**: Futuristic dark theme with neon gradients and glassmorphism
- **Smooth Animations**: GSAP-powered hover effects and transitions
- **Mobile Responsive**: Optimized for all screen sizes
- **Real-time Feedback**: Live transaction status and JSON response display

## 🎨 Design System

### MerakiNexus Theme

- **Colors**: Neon purple (#8B5CF6), neon blue (#06B6D4), neon pink (#EC4899)
- **Background**: Dark gradient with glassmorphism cards
- **Typography**: Inter font family for modern readability
- **Animations**: Subtle hover effects and smooth transitions

### Components

- **Navbar**: Sticky header with wallet connection status
- **Hero Section**: Eye-catching title with feature highlights
- **Payment Form**: Glassmorphism card with animated inputs
- **Response Viewer**: Syntax-highlighted JSON with transaction details

## 🛠️ Tech Stack

- **React 18**: Modern React with hooks
- **TailwindCSS**: Utility-first CSS framework
- **GSAP**: Professional animation library
- **Ethers.js**: Ethereum library for MetaMask integration
- **Create React App**: Development and build tools

## 📦 Installation

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start development server:

```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Usage

### MetaMask Mode (Default)

1. Connect your MetaMask wallet using the navbar button
2. Enter receiver address and amount
3. Click "Send with MetaMask" to send ETH directly

### API Mode (Fallback)

1. When MetaMask is not available, the app switches to API mode
2. Fill in sender address, receiver address, amount, and private key
3. Click "Send with API" to process through the backend

## 🔧 Configuration

### API Endpoint

The app connects to: `https://meraki-nexus-blockchain-api.vercel.app/api/payment`

### Customization

- **Colors**: Edit `tailwind.config.js` to modify the MerakiNexus theme
- **Animations**: Adjust GSAP animations in component files
- **API**: Change the `API_BASE_URL` constant in components

## 📱 Mobile Responsiveness

- **Breakpoints**: Optimized for mobile (320px+), tablet (768px+), desktop (1024px+)
- **Touch Interactions**: Tap-friendly buttons and inputs
- **Layout**: Responsive grid and flex layouts
- **Animations**: Reduced motion for mobile devices

## 🚀 Deployment

### Local Development

```bash
npm start
```

### Production Build

```bash
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize:

- Neon colors
- Dark theme colors
- Gradients
- Shadows

### Animations

Modify GSAP animations in:

- `App.jsx` - Page load animations
- `PaymentForm.jsx` - Form interactions
- `ResponseViewer.jsx` - Response animations
- `Navbar.jsx` - Button hover effects

## 🔒 Security

- **Private Keys**: Only used in API mode, never stored
- **MetaMask**: Secure wallet integration
- **HTTPS**: All API calls use secure connections
- **Validation**: Client-side form validation

## 📊 Performance

- **Lazy Loading**: Components load on demand
- **Optimized Animations**: 60fps smooth animations
- **Bundle Size**: Optimized with Create React App
- **Mobile**: Touch-optimized interactions

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask not detected**: Ensure MetaMask extension is installed
2. **Connection failed**: Check if MetaMask is unlocked
3. **API errors**: Verify network connection and API endpoint
4. **Animations not working**: Check if GSAP is properly installed

### Development

- Use React DevTools for debugging
- Check browser console for errors
- Verify all dependencies are installed
- Ensure Node.js version compatibility

## 📄 License

Built for MerakiNexus 🚀 - Blockchain Payment Solutions
