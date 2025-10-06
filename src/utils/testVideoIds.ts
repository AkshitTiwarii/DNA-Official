// Test script to verify YouTube video IDs and get real data
const videoIds = ['hHiJeD5ORFA', 'IR9vcdyUgSQ', 'P1bOi9DpgMY'];

async function testVideoData() {
  console.log('Testing YouTube video IDs...');
  
  for (const videoId of videoIds) {
    try {
      // Test thumbnail URL
      const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      console.log(`\nVideo ID: ${videoId}`);
      console.log(`Thumbnail URL: ${thumbnailUrl}`);
      console.log(`YouTube URL: https://www.youtube.com/watch?v=${videoId}`);
      
      // Test oEmbed API for basic info
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Title: ${data.title}`);
        console.log(`Author: ${data.author_name}`);
        console.log(`Thumbnail: ${data.thumbnail_url}`);
      } else {
        console.log(`Failed to fetch oEmbed data: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error testing video ${videoId}:`, error);
    }
  }
}

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  testVideoData();
}

export { testVideoData };
