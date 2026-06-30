// Lightweight localStorage-backed "database" that mimics the Base44 entity SDK.
// Each collection is an array of records stored under a namespaced key.

const PREFIX = "premium_properties::";

function read(collection) {
  try {
    const raw = localStorage.getItem(PREFIX + collection);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(collection, records) {
  localStorage.setItem(PREFIX + collection, JSON.stringify(records));
}

function uid() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}

// Returns true only when EVERY key in `query` matches the record.
function matches(record, query) {
  return Object.entries(query || {}).every(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      // Support a couple of simple operators if ever needed.
      if ("$in" in value) return value.$in.includes(record[key]);
      if ("$ne" in value) return record[key] !== value.$ne;
    }
    return record[key] === value;
  });
}

function sortRecords(records, sort) {
  if (!sort) return records;
  const desc = sort.startsWith("-");
  const field = desc ? sort.slice(1) : sort;
  return [...records].sort((a, b) => {
    if (a[field] === b[field]) return 0;
    const cmp = a[field] > b[field] ? 1 : -1;
    return desc ? -cmp : cmp;
  });
}

// Factory that produces an entity object with a Base44-like API.
export function createEntity(collection) {
  return {
    collection,

    async list(sort = "-created_date", limit) {
      const records = sortRecords(read(collection), sort);
      return limit ? records.slice(0, limit) : records;
    },

    async filter(query, sort = "-created_date", limit) {
      const records = sortRecords(
        read(collection).filter((r) => matches(r, query)),
        sort
      );
      return limit ? records.slice(0, limit) : records;
    },

    async get(id) {
      return read(collection).find((r) => r.id === id) || null;
    },

    async create(data) {
      const records = read(collection);
      const record = {
        id: uid(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        ...data,
      };
      records.push(record);
      write(collection, records);
      return record;
    },

    async update(id, data) {
      const records = read(collection);
      const idx = records.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error(`${collection} ${id} not found`);
      records[idx] = {
        ...records[idx],
        ...data,
        updated_date: new Date().toISOString(),
      };
      write(collection, records);
      return records[idx];
    },

    async delete(id) {
      const records = read(collection).filter((r) => r.id !== id);
      write(collection, records);
      return { success: true };
    },

    // Internal helper used by the seeder.
    _seed(records) {
      if (read(collection).length === 0) write(collection, records);
    },
  };
}

export { read, write, uid };
