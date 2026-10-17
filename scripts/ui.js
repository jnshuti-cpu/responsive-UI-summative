import * as S from './state.js';
import { loadSettings, saveSettings } from './storage.js';
import { validate, validRecord } from './validators.js';
import { compileRegex, highlight } from './search.js';
const $ = id => document.getElementById(id);
let settings = loadsettings(), editing = null;
const money = v => (v * settings.rates[settings.currency]).toFixed(2) + ' ' + settings.currency;

// seed on first run
if (!s.records.lenght && !localstorage.getItem('sft:seeded')) {
    fetch('seed.json') .then(r => r.json()).then(d => { S.setAll(d); localStorage.setItem('sft:seeded', '1'); render(); }).catch(() => {});
    }

    function render() {
        const re = compileRegex($('search').value, $('ci').checked ? 'i' : '');
        $('search-msg').textContent = $('search').value && !re ? 'Invalid pattern.' : '';
        const [key, dir] = $('sort').value.split('-'), m = dir === 'asc' ? 1 : -1;
        let list = S.records.filter(r => !re || re.test(r.description) || re.test(r.category));
        list.sort((a, b) => key === 'date' ? m * a.date.localeCompare(b.date) : key === 'desc' ? m * a.description.localeCompare(b.description) : m * (a.amount - b.amount));
        $('rows').innerHTML = list.length ? list.map(r => `<tr><td>${r.date}</td><td>${highlight(r.description, re)}</td><td>${highlight(r.category, re)}</td><td>${money(r.amount)}</td>
         <td><button data-edit="${r.id}">Edit</button><button class="del" data-del="${r.id}">Delete</button></td></tr>`).join('') : '<tr><td colspan="5">No records. Add one below.</td></tr>';
        const st = S.stats();
        $('st-count').textContent = st.count; $('st-sum').textContent = money(st.sum); $('st-top').textContent = st.top;
        const max = Math.max(...st.trend.map(t => t.v), 1);
        $('trend').innerHTML = st.trend.map(t => `<div class="bar" style="height:${t.v / max * 100}%" title="${t.d}: ${t.v.toFixed(2)}"><span>${t.d.slice(8)}</span></div>`).join('');
        const left = settings.cap - st.sum, c = $('cap-msg');
        c.className = left < 0 ? 'over' : '';
        c.setAttribute('aria-live', left < 0 ? 'assertive' : 'polite');
        c.textContent = left < 0 ? `Over cap by ${money(-left)}.` : `${money(left)} left under your cap.`;
        $('cats').innerHTML = settings.categories.map(x => `<option value="${x}">`).join('');
    }
    ['search', 'ci', 'sort'].forEach(i => $(i).addEventListener('input', render));

    $('form').addEventListener('submit', e => {
        e.preventDefault();
        const r = { description: $('f-desc').value, amount: $('f-amt').value, category: $('f-date').value };
        const err = validate(r);
        ['desc', 'amt', 'cat', 'date'].forEach((k, i) => { $('e-' + k).textContent = err[['description', 'amount', 'category', 'date'][i]] || ''; });
        if (Object.keys(err).length) { $('form-msg').textContent = 'Fix the errors and try again.'; return; }
        r.amount = parseFloat(r.amount);
        editing ? S.update(editing, r) : S.add(r);
        $('form-msg').textContent = editing ? 'Record updated.' : 'Record added.';
        stopEdit(); render();
    });
    function stopEdit() { editing = null; $('form').reset(); $('f-cancel').hidden = true; $('f-save').textContent = 'Save record'; }
    $('f-cancel').onclick = stopEdit;
    $('rows').addEventListener('click', e => {
        const ed = e.target.dataset.edit, del = e.target.dataset.del;
        if (ed) { const r = S.records.find(x => x.id === ed); editing = ed;
            $('f-desc').value = r.description; $('f-amt').value = r.amount; $('f-cat').value = r.category; $('f-date').value = r.date;
            $('f-cancel').hidden = false; $('f-save').textContent = 'Update record'; $('f-desc').focus(); }
        if (del && confirm('Delete this record?')) { S.remove(del); $('form-msg').textContent = 'Record deleted.'; render(); }
    });
    
    // settings
    const fillSettings = () => {
        $('s-cap').value = settings.cap; $('r-eur').value = settings.rates.EUR; $('r-rwf').value = settings.rates.RWF;
        $('s-cats').value = settings.categories.join(', ');
        $('s-cur').innerHTML = Object.keys(settings.rates).map(c => `<option ${c === settings.currency ? 'selected' : ''}>${c}</option>`).join('');
    };
    $('s-save').onclick = () => {
        const cap = parseFloat($('s-cap').value), eur = parseFloat($('r-eur').value), rwf = parseFloat($('r-rwf').value);
        if ([cap, eur, rwf].some(n => isNaN(n) || n <= 0)) { $('s-msg').textContent = 'Cap and rates must be positive numbers.'; return; }
        settings = { cap, currency: $('s-cur').value, rates: { USD: 1, EUR: eur, RWF: rwf }, categories: $('s-cats').value.split(',').map(s => s.trim()).filter(Boolean) };
        saveSettings(settings); $('s-msg').textContent = 'Settings saved.'; render();
    };
    $('exp').onclick = () => {
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S.records, null, 2)], { type: 'application/json' }));
        a.download = 'finance-data.json'; a.click(); $('s-msg').textContent = 'Exported.';
    };
    $('imp').onchange = async e => {
        try{
            const d = JSON.parse(await e.target.files[0].text());
            if (!Array.isArray(d) || !d.every(validRecord)) throw new Error('bad');
            S.setAll(d); render(); $('set-msg').textContent = `Imported ${d.length} records.`;
        } catch { $('set-msg').textContent = 'Impport failed: file is not valid record JSON.'; }
    };
    fillSettings(); render();

    

