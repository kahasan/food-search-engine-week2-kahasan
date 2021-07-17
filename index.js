import 'regenerator-runtime/runtime';
import Fuse from 'fuse.js';

import dotenv from 'dotenv';
dotenv.config();

import { getTable } from './lib/airtable';

const cards = document.getElementById('js-cards');

const input = document.getElementById('search');

function createCard(item) {
  const card = document.createElement('div');
  const mealTitle = document.createElement('h3');
  const mealImg = document.createElement('img');
  const mealSide = document.createElement('div');

  mealTitle.innerText = item.strMeal;
  mealImg.src = item.strMealThumb;
  mealSide.innerText = item.strArea;
  card.classList.add('card');

  card.appendChild(mealTitle);
  card.appendChild(mealImg);
  card.appendChild(mealSide);
  cards.appendChild(card);
}

async function getData(searchKey) {
  await getTable('Meals').then((res) => {
    const options = {
      keys: ['strMeal'],
    };
    const fuse = new Fuse(res, options);
    const result = searchKey && fuse.search(searchKey);
    console.log('result', result);

    cards.innerHTML = '';

    !searchKey &&
      res.map((item) => {
        createCard(item);
      });

    result &&
      result.map(({ item }) => {
        createCard(item);
      });
  });
}

getData();

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

input.addEventListener('input', (e) => {
  const value = e.target.value;

  const processChange = debounce(() => getData(value));

  processChange();
});
