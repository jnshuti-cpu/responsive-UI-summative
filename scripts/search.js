export function compileRegex(input, flags = 'i') {
    try { return input ? new RegExp(input, flags) : null; } catch { return null; } 
}
const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export function highlight(text, re) {
    if (!re) return esc(text);
    const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    let out = '', last = 0, m;
    while ((m = g.exec(text)) && m[0] !== '') { out += esc(text.slice(last, m.index)) + '<mark>' + esc(m[0]) + '</mark>'; last = m.index + m[0].length; }
    return out + esc(text.slice(last));
}