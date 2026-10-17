import { load, save } from './storage.js';
export let records = load() || [];
const persist = () => save(records);
export const setAll = list => { records = list; persist(); };
export const add = r => { const now = new Date().toISOString(); const n = records.reduce((m, x) => Math.max(m, parseInt(x.id.replace(/\D/g, '')) || 0), 0) + 1;
    records.push({ ...r, id: 'rec_' + String(n).padStart(4, '0'), createdAt: now, updatedAt: now }); persist(); };
export const update = (id, r) => { const i = records.findIndex(x => x.id === id); if (i > -1) { records[i] = { ...records[i], ...r, updatedAt: new Date().toISOString() }; persist(); } };
export const remove = id => { records = records.filter(x => x.id !== id); persist(); };
export function stats() {
    const sum = records.reduce((s, r) => s + r.amount, 0), by = {};
    records.forEach(r => by[r.category] = (by[r.category] || 0) + 1);
    const top = Object.entries(by).sort((a, b) => b[1] - a[1])[0];
    const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().slice(0, 10); });
    const trend = days.map(d => ({ d, v: records.filter(r => r.date === d).reduce((s, r) => s + r.amount, 0) }));
    return { count: records.length, sum, top: top ? top[0] : 'none', trend };
}