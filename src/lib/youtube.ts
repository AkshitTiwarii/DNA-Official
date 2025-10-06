// YouTube API integration for DNA Official Tech channel
// Channel handle: @dnaofficialtech

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  url: string;
}

interface YouTubeAPIResponse {
  items: Array<{
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        medium: {
          url: string;
        };
        high: {
          url: string;
        };
      };
    };
  }>;
  nextPageToken?: string;
}

// Configuration
export const CHANNEL_HANDLE = 'dnaofficialtech';
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const REFRESH_INTERVAL = parseInt(import.meta.env.VITE_YOUTUBE_REFRESH_INTERVAL) || 60;

// Mock data for development - using realistic data for DNA Official Tech videos
export const getMockYouTubeVideos = (): YouTubeVideo[] => [
  {
    id: 'hHiJeD5ORFA',
    title: 'India\'s New Carbon Credit Trading Scheme Explained: Complete Analysis',
    description: 'A comprehensive breakdown of India\'s new carbon credit trading scheme and its implications for businesses and the environment. Understanding the regulatory framework, market opportunities, and environmental impact of this groundbreaking initiative.',
    thumbnail: 'https://i.ytimg.com/vi/hHiJeD5ORFA/hqdefault.jpg',
    publishedAt: '2025-08-30T10:00:00Z',
    duration: 'PT24M25S',
    viewCount: '44',
    url: 'https://youtu.be/hHiJeD5ORFA'
  },
  {
    id: 'IR9vcdyUgSQ',
    title: 'Blockchain Explained: A Comprehensive Guide to its Technology and Applications',
    description: 'Deep dive into blockchain technology with this comprehensive guide. Learn how blockchain works, its real-world applications, and why it\'s revolutionizing industries. Perfect for beginners and professionals looking to understand distributed ledger technology.',
    thumbnail: 'https://i.ytimg.com/vi/IR9vcdyUgSQ/hqdefault.jpg',
    publishedAt: '2025-08-17T14:30:00Z',
    duration: 'PT53M24S',
    viewCount: '41',
    url: 'https://youtu.be/IR9vcdyUgSQ'
  },
  {
    id: 'P1bOi9DpgMY',
    title: 'DNA – Shaping the Future of Developers | Official Channel Introduction',
    description: 'Welcome to DNA Official Tech! Discover how we\'re shaping the future of developers through innovative programming tutorials, tech insights, and comprehensive coding courses. Join our community of passionate developers and tech enthusiasts.',
    thumbnail: 'https://i.ytimg.com/vi/P1bOi9DpgMY/hqdefault.jpg',
    publishedAt: '2025-08-10T16:45:00Z',
    duration: 'PT1M25S',
    viewCount: '102',
    url: 'https://youtu.be/P1bOi9DpgMY'
  }
];

// Real YouTube API functions (requires API key)
export const fetchYouTubeVideos = async (maxResults: number = 50): Promise<YouTubeVideo[]> => {
  // If no API key, use mock data
  if (!API_KEY) {
    console.log('No YouTube API key provided, using mock data');
    return getMockYouTubeVideos();
  }

  try {
    // First, get channel ID from handle
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=@${CHANNEL_HANDLE}&key=${API_KEY}`
    );
    
    if (!channelResponse.ok) {
      throw new Error(`Channel search failed: ${channelResponse.status}`);
    }
    
    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('Channel not found');
    }
    
    const actualChannelId = channelData.items[0].id.channelId;
    console.log(`Found channel ID: ${actualChannelId}`);
    
    // Fetch videos from the channel
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${actualChannelId}&type=video&order=date&maxResults=${maxResults}&key=${API_KEY}`
    );
    
    if (!videosResponse.ok) {
      throw new Error(`Videos fetch failed: ${videosResponse.status}`);
    }
    
    const videosData: YouTubeAPIResponse = await videosResponse.json();
    
    // Get detailed video information
    const videoIds = videosData.items.map(item => item.id.videoId).join(',');
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
    );
    
    if (!detailsResponse.ok) {
      throw new Error(`Video details fetch failed: ${detailsResponse.status}`);
    }
    
    const detailsData = await detailsResponse.json();
    
    // Combine data
    const videos: YouTubeVideo[] = videosData.items.map((item, index) => {
      const details = detailsData.items[index];
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        duration: details?.contentDetails.duration || 'PT0S',
        viewCount: details?.statistics.viewCount || '0',
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      };
    });
    
    console.log(`Successfully fetched ${videos.length} videos from DNA Official Tech`);
    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    console.log('Falling back to mock data');
    // Fallback to mock data
    return getMockYouTubeVideos();
  }
};

// Auto-refresh function to check for new videos
export const setupAutoRefresh = (callback: (videos: YouTubeVideo[]) => void, intervalMinutes: number = REFRESH_INTERVAL) => {
  console.log(`Setting up auto-refresh every ${intervalMinutes} minutes`);
  
  const interval = setInterval(async () => {
    try {
      console.log('Auto-refreshing YouTube videos...');
      const videos = await fetchYouTubeVideos();
      callback(videos);
      console.log('Auto-refresh completed successfully');
    } catch (error) {
      console.error('Auto-refresh failed:', error);
    }
  }, intervalMinutes * 60 * 1000);
  
  return () => {
    console.log('Cleaning up auto-refresh interval');
    clearInterval(interval);
  };
};

// Convert YouTube duration (PT15M30S) to readable format
export const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return duration;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Format view count
export const formatViewCount = (count: string): string => {
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`;
  }
  return `${num} views`;
};

// Format publish date
export const formatPublishDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};
