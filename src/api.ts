import axios from 'axios';

// const API_KEY = '92323450e03554bb18bde931be248a4f';
const BASE_PATH = 'https://api.themoviedb.org/3';

interface MovieResult {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface MovieDataProps {
  datas: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: MovieResult[];
  total_pages: number;
  total_results: number;
}

export interface YoutubeDataProps {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  };
}

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MjMyMzQ1MGUwMzU1NGJiMThiZGU5MzFiZTI0OGE0ZiIsInN1YiI6IjY2MmNhZjk0MDI4ZjE0MDEyMjY4NjVkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sbxMx311toX_9SAmkYxUWENEO3z-gQK4GZhYmbUeXbg',
  },
};

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?language=en-US`, options).then(
    (response) => response.json()
  );
}
