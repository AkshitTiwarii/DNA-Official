// Utility to extract real video data from YouTube URLs
export const extractVideoData = async (videoUrls: string[]) => {
  // For now, let's use the oEmbed API which is public and doesn't require API key
  const videoData = [];
  
  for (const url of videoUrls) {
    try {
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/)?.[1];
      if (videoId) {
        // Use YouTube oEmbed API to get basic video info
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        
        if (response.ok) {
          const data = await response.json();
          videoData.push({
            id: videoId,
            title: data.title,
            author_name: data.author_name,
            thumbnail_url: data.thumbnail_url,
            html: data.html
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching data for ${url}:`, error);
    }
  }
  
  return videoData;
};

// Use this to get real data when the page loads
export const getRealVideoData = () => {
  const videoUrls = [
    'https://youtu.be/hHiJeD5ORFA',
    'https://youtu.be/IR9vcdyUgSQ', 
    'https://youtu.be/P1bOi9DpgMY'
  ];
  
  return extractVideoData(videoUrls);
};
