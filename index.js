import 'regenerator-runtime/runtime';
import Fuse from 'fuse.js';

import dotenv from 'dotenv';
dotenv.config();

import { getTable } from './lib/airtable';

const cards = document.getElementById('js-cards');
const title = document.createElement('h1');

async function getData(searchKey) {
  await getTable('Meals').then((res) => {
    res.forEach((element) => {
      const fuse = new Fuse([element], {
        keys: ['strMeal'],
      });
      const result = fuse.search(searchKey);
      if (result.length < 0) return;
      result.length > 0 && (title.innerText = result[0].item.strMeal);
      cards.appendChild(title);
    });
  });
}

getData('cor');
