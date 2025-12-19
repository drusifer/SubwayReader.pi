import { ProxyResponse } from '../types';
import { MOCK_MARKDOWN_CONTENT } from '../constants';

export const fetchArticle = async (
  url: string, 
  serverUrl: string, 
  isSimulated: boolean
): Promise<ProxyResponse> => {
  
  if (isSimulated) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      title: "Simulated Article Title",
      content: MOCK_MARKDOWN_CONTENT,
      excerpt: "This is a simulated excerpt for testing purposes.",
      siteName: "Simulated Source"
    };
  }

  // Live Mode: Connect to user's self-hosted proxy
  // Endpoint: GET /api/parse?url=...
  const target = new URL('/api/parse', serverUrl);
  target.searchParams.append('url', url);

  try {
    const response = await fetch(target.toString());
    
    if (!response.ok) {
      throw new Error(`Proxy error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate response shape
    if (!data.content) {
      throw new Error("Invalid response format from proxy: missing content");
    }

    return {
      title: data.title || "Untitled",
      content: data.content,
      excerpt: data.excerpt,
      siteName: data.siteName
    };

  } catch (error) {
    console.error("Fetch article failed:", error);
    throw error;
  }
};