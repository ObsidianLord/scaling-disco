import bg from '../img/icons/bg.png';

import sad from '../img/icons/emotions/sad.svg';
import calm from '../img/icons/emotions/calm.svg';
import energetic from '../img/icons/emotions/energetic.svg';
import happy from '../img/icons/emotions/happy.svg';
import sleepy from '../img/icons/emotions/sleepy.svg';

export default {
  HAPPY: {
    name: 'Веселое',
    photo_url: happy,
    bg_url: bg,
  },
  ENERGETIC: {
    name: 'Энергичное',
    photo_url: energetic,
    bg_url: bg,
  },
  SAD: {
    name: 'Грустное',
    photo_url: sad,
    bg_url: bg,
  },
  SLEEPY: {
    name: 'Сонное',
    photo_url: sleepy,
    bg_url: bg,
  },
  CALM: {
    name: 'Спокойное',
    photo_url: calm,
    bg_url: bg,
  },
};