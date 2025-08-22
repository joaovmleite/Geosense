const axios = require('axios');

exports.handler = async () => {
  try {
    const apiKey = process.env.NEWSAPI_ACCESS_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing News API keyin environment.' }),
      };
    }

    // Request a larger set, we will filter to ensure 4 with content
    const { data } = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: { country: 'us', pageSize: 30, apiKey },
      timeout: 10000,
    });

    const articles = Array.isArray(data?.articles) ? data.articles : [];

    const cleaned = articles
      .map((a) => {
        const rawContent = a?.content || '';
        const content = rawContent.replace(/\s*\[\+\d+\s+chars\]$/i, '');
        const description = a?.description || '';
        return {
          source: a?.source?.name || null,
          author: a?.author || null,
          title: a?.title || '',
          description,
          url: a?.url || '',
          urlToImage: a?.urlToImage || '',
          publishedAt: a?.publishedAt || '',
          content,
        };
      })
      .filter((a) => {
        const text = (a.content || a.description || '').trim();
        return text.length >= 20; // heuristic: ensure non-empty, informative text
      })
      .slice(0, 4);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles: cleaned }),
    };
  } catch (err) {
    const status = err.response?.status || 500;
    return {
      statusCode: status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to fetch news from NewsAPI.',
        details: err.response?.data || err.message,
      }),
    };
  }
};