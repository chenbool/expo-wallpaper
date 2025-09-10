import axios from "axios";

const API_KEY = '52184162-a6c880c119539b5d652e7867d';

// 读取env
// const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

// 格式化url
const formatUrl = (params) => { // {q, page, category, order}
  let url = apiUrl + "&per_page=25&safesearch=true&editors_choice=true"
  if (!params) return url;
  let paramKeys = Object.keys(params);
  paramKeys.map(key => {
    let value = key === 'q' ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });
  // console.log('url: ', url);
  return url;
}


export const apiCall = async (params) => {
    try {
        const response = await axios.get(formatUrl(params));
        const { data } = response;
        return { success: true, data };
    } catch (err) {
        console.log('error: ', err.message);
        return { success: false, msg: err.message };
    }
};