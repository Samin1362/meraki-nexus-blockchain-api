# 🚀 Netlify Deployment Guide

## Manual Deployment to Netlify

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Netlify account
- Git repository (optional)

### Build Commands

#### 1. Install Dependencies

```bash
cd frontend
npm install
```

#### 2. Build the Project

```bash
npm run build
```

#### 3. Preview Build (Optional)

```bash
npm run preview
```

#### 4. Deploy to Netlify

### Option A: Drag & Drop Deployment

1. **Build the project:**

   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Go to Netlify Dashboard:**

   - Visit [netlify.com](https://netlify.com)
   - Sign in to your account

3. **Drag & Drop:**
   - Drag the `build` folder to the Netlify deploy area
   - Your site will be deployed automatically

### Option B: Git-based Deployment

1. **Connect Repository:**

   - Go to Netlify Dashboard
   - Click "New site from Git"
   - Connect your GitHub/GitLab repository

2. **Build Settings:**

   - **Build command:** `npm run build`
   - **Publish directory:** `build`
   - **Node version:** 18

3. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy

### Option C: Netlify CLI

1. **Install Netlify CLI:**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**

   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod --dir=build
   ```

### Build Configuration

The project includes a `netlify.toml` file with the following settings:

```toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"
```

### Environment Variables

If you need to set environment variables in Netlify:

1. Go to Site Settings → Environment Variables
2. Add any required variables:
   - `REACT_APP_API_URL` (if needed)
   - `REACT_APP_CHAIN_ID` (if needed)

### Custom Domain (Optional)

1. Go to Site Settings → Domain Management
2. Add your custom domain
3. Configure DNS settings as instructed by Netlify

### Build Optimization

The build process includes:

- ✅ **Source maps disabled** for production
- ✅ **Asset optimization** with proper caching
- ✅ **SPA routing** configured
- ✅ **Security headers** set
- ✅ **Performance optimizations**

### Troubleshooting

#### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### TailwindCSS Issues

```bash
# Ensure TailwindCSS is properly configured
npx tailwindcss init
```

#### GSAP Issues

```bash
# Ensure GSAP is installed
npm install gsap
```

### Performance Checklist

- ✅ **Build size optimized**
- ✅ **Images compressed**
- ✅ **CSS/JS minified**
- ✅ **Caching headers set**
- ✅ **SPA routing configured**

### Post-Deployment

After deployment:

1. Test all functionality
2. Check MetaMask integration
3. Verify network switching
4. Test responsive design
5. Check console for errors

### Monitoring

- Use Netlify Analytics for traffic monitoring
- Check build logs for any issues
- Monitor Core Web Vitals
- Test on different devices and browsers

## 🎉 Deployment Complete!

Your MerakiNexus Payment frontend is now live on Netlify with:

- ✅ **Responsive design**
- ✅ **MetaMask integration**
- ✅ **Network switching**
- ✅ **Modern UI/UX**
- ✅ **Production optimizations**
