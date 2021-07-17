import dotenv from 'dotenv';
dotenv.config();

import Airtable from 'airtable';

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: `${process.env.AIRTABLE_API_KEY}`,
});

const base = Airtable.base(`${process.env.AIRTABLE_BASE_ID}`);

const minifiedRecords = (records) => {
  return records.map((record) => minifyRecord(record));
};

const minifyRecord = (record) => {
  return {
    Id: record.id,
    ...record.fields,
  };
};

async function getTable(Table) {
  const records = await base(Table)
    .select({
      maxRecords: 20,
      view: 'Grid view',
    })
    .all();

  const data = await minifiedRecords(records);

  return data.filter((o) => !o.Draft);
}

export { getTable };
