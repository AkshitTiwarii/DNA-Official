# YouTube Integration Setup

This guide explains how to set up YouTube integration for the DNA Forge Hub project to automatically fetch videos from the DNA Official Tech channel.

## Quick Start (Using Mock Data)

The system works out of the box with mock data. No setup required!

## Production Setup (Real YouTube Data)

### 1. Get a YouTube API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```env
   VITE_YOUTUBE_API_KEY=your_actual_api_key_here
   VITE_YOUTUBE_REFRESH_INTERVAL=60
   ```

### 3. Restart Development Server

```bash
npm run dev
```

## Features

### 🔄 Auto-Refresh System
- Automatically checks for new videos every 60 minutes (configurable)
- Graceful fallback to mock data if API fails
- Console logging for monitoring

### 📺 Video Display
- Beautiful video cards with thumbnails
- Video duration and view count
- Publish date (relative time)
- Direct links to YouTube

### 🔍 Search & Filter
- Search videos by title and description
- Real-time filtering as you type
- Responsive grid and list views

### 📊 Analytics
- Video view counts formatted (1.2K, 1.5M views)
- Duration in MM:SS or H:MM:SS format
- Relative publish dates (2 days ago, 1 week ago)

## Channel Information

- **Channel**: DNA Official Tech
- **Handle**: @dnaofficialtech
- **URL**: https://youtube.com/@dnaofficialtech

## API Quotas

YouTube API has daily quotas:
- **Free tier**: 10,000 units per day
- **Each video fetch**: ~3-5 units
- **Recommended**: Check every 60+ minutes to stay within limits

## Troubleshooting

### No videos showing?
1. Check browser console for error messages
2. Verify API key is correct in `.env`
3. Ensure YouTube Data API v3 is enabled
4. Check API quota hasn't been exceeded

### API key not working?
1. Make sure the API key has no restrictions that block YouTube Data API
2. Try regenerating the API key
3. Verify the correct project is selected in Google Cloud Console

### Mock data vs Real data
- Without API key: Shows 8 sample videos
- With API key: Shows real videos from DNA Official Tech channel

## Development

The system automatically:
- Fetches latest videos on page load
- Sets up auto-refresh interval
- Handles errors gracefully
- Provides detailed console logging

## Security

- API key is only used client-side for this demo
- For production, consider server-side API calls
- Never commit real API keys to version control
- Use environment variables for sensitive data
