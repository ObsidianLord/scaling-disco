import sad from '../img/icons/emotions/sad.svg';
import calm from '../img/icons/emotions/calm.svg';
import energetic from '../img/icons/emotions/energetic.svg';
import happy from '../img/icons/emotions/happy.svg';
import sleepy from '../img/icons/emotions/sleepy.svg';

export default {
  HAPPY: {
    key: 'HAPPY',
    name: 'Веселое',
    emoji: '😃',
    photo_url: happy,
  },
  ENERGETIC: {
    key: 'ENERGETIC',
    name: 'Энергичное',
    emoji: '😜',
    photo_url: energetic,
  },
  SAD: {
    key: 'SAD',
    name: 'Грустное',
    emoji: '🙁',
    photo_url: sad,
  },
  SLEEPY: {
    key: 'SLEEPY',
    emoji: '😴',
    name: 'Сонное',
    photo_url: sleepy,
  },
  CALM: {
    key: 'CALM',
    emoji: '😐',
    name: 'Спокойное',
    photo_url: calm,
  },
};