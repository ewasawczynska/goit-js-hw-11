import axios from 'axios';

const api_key = '38224986-73ed753b6801a898f531e9036';
const urlPixabay = 'https://pixabay.com/api/';

export function init(api_key) {
  axios.defaults.headers.common['x-api-key'] = api_key;
}
export async function searchImage(query, page) {
  const url = `${urlPixabay}?key=${api_key}&q=${encodeURIComponent(
    query
  )}&page=${page}&per_page=20&image_type=photo&orientation=horizontal&safesearch=true`;
  const response = await axios.get(url);
  return response.data;
}
