import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_URL || 'https://hacaton-2-d4cu.onrender.com/api'

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
})

export function authHeaders() {
  try {
    const raw = window.localStorage.getItem('lp-token')
    if (!raw) return {}
    // localStorage JSON formatida saqlanadi (qo'shtirnoqlar bilan) — parse qilamiz
    let token = raw
    try {
      token = JSON.parse(raw)
    } catch {
      /* eski format: oddiy string */
    }
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch {
    return {}
  }
}

export function errMsg(err, fallback) {
  return err?.response?.data?.error || err?.message || fallback
}

// ---- Auth ----
export async function register(payload) {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload)
  return data
}

// ---- Health ----
export async function getHealthScore() {
  const { data } = await api.get('/health/score', { headers: authHeaders() })
  return data
}

// ---- Medicine ----
export async function getMeds() {
  const { data } = await api.get('/medicine', { headers: authHeaders() })
  return data
}

export async function addMed(payload) {
  const { data } = await api.post('/medicine', payload, { headers: authHeaders() })
  return data
}

export async function updateMed(id, payload) {
  const { data } = await api.put(`/medicine/${id}`, payload, { headers: authHeaders() })
  return data
}

// ---- Sleep ----
export async function getSleep() {
  const { data } = await api.get('/sleep', { headers: authHeaders() })
  return data
}

export async function addSleep(payload) {
  const { data } = await api.post('/sleep', payload, { headers: authHeaders() })
  return data
}

// ---- Water ----
export async function getWater() {
  const { data } = await api.get('/water', { headers: authHeaders() })
  return data
}

export async function addWater(payload) {
  const { data } = await api.post('/water', payload, { headers: authHeaders() })
  return data
}

// ---- SOS ----
export async function getSosContacts() {
  const { data } = await api.get('/sos/contact', { headers: authHeaders() })
  return data
}

export async function addSosContact(payload) {
  const { data } = await api.post('/sos/contact', payload, { headers: authHeaders() })
  return data
}

export async function sendSos() {
  const { data } = await api.post('/sos/send', {}, { headers: authHeaders() })
  return data
}
