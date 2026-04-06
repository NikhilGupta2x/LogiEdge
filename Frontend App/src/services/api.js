import axios from "axios";

const BASE_URL = "https://logiedge.onrender.com/api";

// ── customer api calls ───────────────
export const getAllCustomers = () => {
  return axios.get(BASE_URL + "/customers");
};

export const createCustomer = (customerData) => {
  return axios.post(BASE_URL + "/customers", customerData);
};

// ── items api calls ──────────────────
export const getAllItems = () => {
  return axios.get(BASE_URL + "/items");
};

export const createItem = (itemData) => {
  return axios.post(BASE_URL + "/items", itemData);
};

// ── invoice api calls ────────────────
export const getAllInvoices = () => {
  return axios.get(BASE_URL + "/invoices");
};

export const getInvoiceById = (invoiceId) => {
  return axios.get(BASE_URL + "/invoices/" + invoiceId);
};

export const getInvoicesByCustomer = (customerId) => {
  return axios.get(BASE_URL + "/invoices/customer/" + customerId);
};

export const createInvoice = (invoiceData) => {
  return axios.post(BASE_URL + "/invoices", invoiceData);
};
