import axios from 'axios';
import baseUrl from './baseUrl';

const fetchData = (endpoint, token) => {
  const url = `${baseUrl}/api/${endpoint}`;
  const headers = { headers: { Authorization: token } };
  return axios.get(url, headers);
};

const postData = (endpoint, payload, token) => {
  const url = `${baseUrl}/api/${endpoint}`;
  const headers = { headers: { Authorization: token } };
  return axios.post(url, payload, headers);
};

const loginWith = user => {
  const url = `${baseUrl}/api/login`;
  const payload = { ...user };
  return axios.post(url, payload);
};

const signupWith = user => {
  const url = `${baseUrl}/api/signup`;
  const payload = { ...user };
  return axios.post(url, payload);
};

export default {
  fetchData,
  postData,
  loginWith,
  signupWith,
};
