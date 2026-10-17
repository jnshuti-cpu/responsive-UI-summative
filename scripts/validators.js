export const RULES = {
    description: /^\S(?:.*\S)?$/,
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    dupWord: /\b(\w+)\s+\1\b/i 
};
export function validate(r) {
    const e = {};
    if (!RULES.description.test(r.description)) e.description = 'No leading or trailing spaces; required.';
    else if (/\s{2,}/.test(r.description)) e.description = 'Use single spaces between words.';
    else if (RULES.dupWord.test(r.description)) e.description = 'Repeated word found. Check for a typo.';
    if (!RULES.amount.test(String(r.amount))) e.amount = 'Use a number like 12 or 12.50.';
    if (!RULES.date.test(r.date)) e.date = 'use YYYY-MM-DD.';
    if (!RULES.category.test(r.category)) e.category = 'Letters, spaces and hyphens only.';
    return e;
}
export function validRecord(r) {
    return r && typeof r.id === 'string' && Object.keys(validate({ ...r, amount: String(r.amount) })).length === 0
        && typeof r.createdAt === 'string' && typeof r.updatedAt === 'string';
}