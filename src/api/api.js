import Categories from '../data/categories';
import Emotions from '../data/emotions';

import michael from '../img/avatars/michael.png';
import chicago from '../img/photos/chicago.png';

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

export const getRandomLatLng = (center) => {
  return center.map((point) => point + (Math.random() - 0.5) * DEFAULT_GENERATED_POSTS_RADIUS);
};

export const getRandomPost = (id) => ({
  id,
  author: 'Михаил',
  avatar_url: michael,
  date: 'час назад',
  latlng: getRandomLatLng(DEFAULT_MAP_CENTER),
  category: getRandomCategory(),
  emotion: getRandomEmotion(),
  likes_count: 65,
  comments_count: 65,
  reposts_count: 4,
  views_count: '7,2К',
  photo_url: chicago
});