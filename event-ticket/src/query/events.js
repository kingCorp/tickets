import axios from 'axios';
import BASE_API from '../constants/uri';

export const fetchEvents = async () => {
  const res = await axios.get(`${BASE_API}/event`);
  return res.data.data;
};

export const postEvents = async ({
  form
}) => {
  const data = {
    title: form.title,
    description: form.description,
  };
  const res = await axios.post(`${BASE_API}/event`, data);
  return res;
};

export const postTicket = async ({
  form
}) => {
  const data = {
    code: form.code,
    phone: form.phone,
    price: form.price,
    quantity: form.quantity
  };
  const res = await axios.post(`${BASE_API}/ticket/${form.id}`, data);
  return res;
};

export const fetchTickets = async (key, id) => {
  const res = await axios.get(`${BASE_API}/ticket/${id}/event`);
  return res.data.data;
};

export const fetchTicket = async (key, id) => {
    const res = await axios.get(`${BASE_API}/ticket/${id}`);
    return res.data.data;
  };

export const statusTicket = async (key, id) => {
  const res = await axios.get(`${BASE_API}/ticket/${id}/status`);
  return res.data.data;
};

export const corkageTicket = async (key, id) => {
  const res = await axios.get(`${BASE_API}/ticket/${id}/corkage`);
  return res.data.data;
};
