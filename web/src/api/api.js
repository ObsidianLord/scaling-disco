import Categories from '../data/categories';
import Emotions from '../data/emotions';
import Authors from '../data/authors';
import Dates from '../data/dates';
import Photos from '../data/photos';
import Texts from '../data/texts';

import { DEFAULT_MAP_CENTER } from '../consts/map';
import { DEFAULT_GENERATED_POSTS_RADIUS } from '../consts/config';

export const getRandomCategory = () => {
  const keys = Object.keys(Categories);
  const randomIndex = Math.floor( Math.random() * keys.length );
  return Categories[keys[randomIndex]];
};

export const getRandomEmotion = () => {
  const keys = Object.keys(Emotions);
  const randomIndex = Math.floor( Math.random() * keys.length );
  return Emotions[keys[randomIndex]];
};

export const getRandomDate = () => {
  const randomIndex = Math.floor( Math.random() * Dates.length );
  return Dates[randomIndex];
};

export const getRandomText = () => {
  const randomIndex = Math.floor( Math.random() * Texts.length );
  return Texts[randomIndex];
};

export const getRandomPhoto = () => {
  const randomIndex = Math.floor( Math.random() * Photos.length );
  return Photos[randomIndex];
};

export const getRandomAuthor = () => {
  const randomIndex = Math.floor( Math.random() * Authors.length );
  return Authors[randomIndex];
};

export const getRandomLatLng = (center) => {
  return center.map((point) => point + (Math.random() - 0.5) * DEFAULT_GENERATED_POSTS_RADIUS);
};

export const getRandomPost = (id) => {
  const author = getRandomAuthor();
  const category = getRandomCategory();
  const emotion = getRandomEmotion();
  const date = getRandomDate();
  const latlng = getRandomLatLng(DEFAULT_MAP_CENTER);
  const content = Math.random() > 0.5
    ? { photo_url: getRandomPhoto() }
    : { text: getRandomText() };
  
  return {
    id,
    author: author.name,
    avatar_url: author.avatar_url,
    date,
    latlng,
    category,
    emotion,
    likes_count: Math.floor( Math.random() * 1000 ),
    comments_count: Math.floor( Math.random() * 300 ),
    reposts_count: Math.floor( Math.random() * 100 ),
    views_count: `${Math.floor( Math.random() * 21 )},${Math.floor( Math.random() * 10 )}K`,
    ...content
  }
};