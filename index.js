import 'regenerator-runtime/runtime';
import Fuse from 'fuse.js';

import dotenv from 'dotenv';
dotenv.config();

import { getTable } from './lib/airtable';

class SearhFood {
  constructor(mealsObj) {
    this.store = {
      meals: mealsObj.map(({ item }) => ({ ...item, isFavorited: false })),
    };
    this.cards = document.getElementById('js-cards');
    this.input = document.getElementById('search');

    this.showCard();

    this.input.addEventListener('input', (e) => {
      console.log('triggered');
      function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            func.apply(this, args);
          }, timeout);
        };
      }
      const processChange = debounce(() => this.searchItem(e.target.value));
      processChange();
    });
  }

  searchItem(value) {
    if (!value) return;
    const options = {
      keys: ['strMeal'],
    };

    const fuse = new Fuse(this.store.meals, options);
    const searhResponse = value && fuse.search(value);
    const newResponse = searhResponse.map(({ item }) => ({ ...item }));
    this.store.meals = newResponse;
    this.showCard();
  }

  showCard() {
    this.cards.innerHTML = '';

    const mealsData = this.store.meals.map((meal) => {
      this.createCard(meal);
    });
    return mealsData;
  }

  createCard(item) {
    const { strMeal, strMealThumb, strArea, isFavorited } = item;

    const card = document.createElement('div');
    const mealTitle = document.createElement('h3');
    const mealImg = document.createElement('img');
    const mealSide = document.createElement('div');
    const favBtn = document.createElement('img');

    card.classList.add('card');
    favBtn.classList.add('fav-btn');

    favBtn.src = isFavorited ? 'liked.svg' : 'like.svg';
    mealTitle.innerText = strMeal;
    mealImg.src = strMealThumb;
    mealSide.innerText = strArea;

    card.appendChild(mealTitle);
    card.appendChild(mealImg);
    card.appendChild(mealSide);
    card.appendChild(favBtn);
    this.cards.appendChild(card);
  }
}

(async function getData() {
  await getTable('Meals').then((res) => {
    const response = res.map((item) => ({ item: { ...item } }));
    new SearhFood(response);
  });
})();
