# Vercel Deployment Guide for Sell It Dude

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a cloud database at [mongodb.com/atlas](https://mongodb.com/atlas)
3. **GitHub Repository**: Push your code to GitHub

## Environment Variables Setup

You need to configure these environment variables in Vercel:

### Required Variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here
```

### Optional Variables (if using these services):

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@your-domain.com
```

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Add all changes
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment"

# Push to GitHub
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: sell-it-dude
# - Directory: ./
# - Override settings? No
```

#### Option B: Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Configure Environment Variables

In Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add all required environment variables
3. Set them for all environments (Production, Preview, Development)

### 4. MongoDB Atlas Setup

1. **Create Cluster**:

   - Go to [MongoDB Atlas](https://mongodb.com/atlas)
   - Create a new cluster (free tier available)

2. **Database Access**:

   - Create a database user
   - Note down username and password

3. **Network Access**:

   - Add IP address: `0.0.0.0/0` (allow from anywhere)
   - Or use Vercel's IP addresses

4. **Connection String**:
   - Get connection string from Atlas
   - Replace `<username>` and `<password>`
   - Use this as `MONGODB_URI`

### 5. NextAuth Configuration

1. **Generate Secret**:

   ```bash
   openssl rand -base64 32
   ```

   Use this as `NEXTAUTH_SECRET`

2. **Set URL**:
   ```env
   NEXTAUTH_URL=https://your-app-name.vercel.app
   ```

### 6. Domain Configuration (Optional)

If using custom domain:

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` to use custom domain

## Troubleshooting

### Common Issues:

1. **Build Errors**:

   ```bash
   # Test build locally
   npm run build
   ```

2. **Environment Variables**:

   - Check all variables are set in Vercel
   - No spaces around `=` in env vars
   - Restart deployment after adding env vars

3. **Database Connection**:

   - Verify MongoDB URI format
   - Check network access settings in Atlas
   - Ensure user has proper permissions

4. **API Routes**:
   - Check function timeout settings
   - Verify API routes are in correct directories

### Performance Optimization:

1. **Image Optimization**: Already configured in `next.config.js`
2. **Compression**: Enabled in config
3. **Caching**: Headers configured for optimal caching
4. **Bundle Analysis**: Run `npm run build` to check bundle size

## Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Authentication works (sign in/out)
- [ ] Database operations work (CRUD)
- [ ] File uploads work (if using UploadThing)
- [ ] Email sending works (if using SendGrid)
- [ ] Mobile responsiveness
- [ ] Performance audit with Lighthouse

## Monitoring and Maintenance

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Monitor function logs in Vercel dashboard
3. **Performance**: Use Vercel Speed Insights
4. **Database**: Monitor usage in MongoDB Atlas

## Scaling Considerations

- **Vercel Pro**: For higher limits and better performance
- **MongoDB**: Upgrade cluster as needed
- **CDN**: Images automatically served via Vercel Edge Network
- **Database Indexing**: Add indexes for better query performance

## Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- MongoDB Atlas Docs: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

---

🚀 Your app should now be live at `https://your-app-name.vercel.app`!
