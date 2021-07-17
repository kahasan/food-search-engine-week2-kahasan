import 'regenerator-runtime/runtime';
import Fuse from 'fuse.js';

import { getTable } from './lib/airtable';

const header = document.getElementById('user');

class SearhFood {
  constructor(mealsObj) {
    this.store = {
      meals: mealsObj.map(({ item }) => ({ ...item, isFavorited: false })),
    };
    this.cards = document.getElementById('js-cards');
    this.input = document.getElementById('search');

    this.showCard();

    this.input.addEventListener('input', (e) => {
      //debouncing func for avoid unnecessary searh event
      function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            func.apply(this, args);
          }, timeout);
        };
      }
      //send input valut to searhItem func with debounce func
      //with that way searchItem func will triggered after 300ms
      const processChange = debounce(() => this.searchItem(e.target.value));
      processChange();
    });
  }

  searchItem(value) {
    //if there is nothin in input then just pass the func
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
    //reset cards html avoid of repetition
    this.cards.innerHTML = '';

    const mealsData = this.store.meals.map((meal) => {
      this.createCard(meal);
    });
    return mealsData;
  }

  createCard(item) {
    //basic dom operations
    const { strMeal, strMealThumb, strArea, isFavorited } = item;

    const card = document.createElement('div');
    const mealTitle = document.createElement('h3');
    const mealImg = document.createElement('img');
    const mealSide = document.createElement('div');
    const favBtn = document.createElement('img');

    card.classList.add('card');
    favBtn.classList.add('fav-btn');

    //if the meal in favorites this icon changes
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

//getch User info and change header text with user name
(async function fetchUser() {
  await fetch('https://jsonplaceholder.typicode.com/users/1')
    .then((res) => res.json())
    .then((x) => (header.innerText = x.name));
})();

//get data from airtable api
(async function getData() {
  await getTable('Meals').then((res) => {
    //to get same value with reponse of fuse.search,
    //iteration response variable.
    //Your this.store.meals variable will be like that format {item: sameData}
    const response = res.map((item) => ({ item: { ...item } }));
    new SearhFood(response);
  });
})();
