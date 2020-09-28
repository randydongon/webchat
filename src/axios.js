import axios from 'axios';

const KEY = 'AIzaSyAExlx26OVuVYqinkcdJUWANJR4lzRW14o';
const instance = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=',
  params: {
    part: 'snippet',
    maxResults: 5,
    key: KEY
  }
});

export default instance;
//AIzaSyAExlx26OVuVYqinkcdJUWANJR4lzRW14o
//AIzaSyDRTjt4auwZlYbKxUXXEFvCijGuMRChDJc

// 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=the%20weekend&key=AIzaSyAExlx26OVuVYqinkcdJUWANJR4lzRW14o'
