const K = 'sft:data', S = 'sft:settings';
export const DEFAULT_SETTINGS = { cap: 500, currency: 'USD', rates: { USD: 1, EUR: 0.9, RWF: 1400 }, categories: ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'] };
export const load = () => { try { return JSON.parse(localStorage.getItem(K) || 'null'); } catch { return null; } };
export const save = d => localStorage.setItem(K, JSON.stringify(d));
export const loadSettings = () => { try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(S) || '{}') }; } catch { return DEFAULT_SETTINGS; } };
export const savesettings = s => localStorage.setItem(S, JSON.stringify(s));