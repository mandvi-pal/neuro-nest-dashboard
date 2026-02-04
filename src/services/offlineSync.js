// src/services/offlineSync.js
const KEY = 'smartScreeningQueue';

export const queueResult = (payload) => {
  const q = JSON.parse(localStorage.getItem(KEY) || '[]');
  q.push({ payload, ts: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(q));
};

export const flushQueue = async (syncFn) => {
  const q = JSON.parse(localStorage.getItem(KEY) || '[]');
  const remaining = [];
  for (const item of q) {
    try {
      await syncFn(item.payload);
    } catch {
      remaining.push(item);
    }
  }
  localStorage.setItem(KEY, JSON.stringify(remaining));
  return { sent: q.length - remaining.length, pending: remaining.length };
};
