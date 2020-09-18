import Categories from './categories';
import Emotions from './emotions';

import michael from '../img/avatars/michael.png';
import chicago from '../img/photos/chicago.png';

export default [
  {
    id: 1,
    author: 'Михаил',
    avatar_url: michael,
    date: 'час назад',
    latlng: [59.9355684, 30.3255795],
    category: Categories.PHOTO,
    emotion: Emotions.CALM,
    likes_count: 65,
    comments_count: 65,
    reposts_count: 4,
    views_count: '7,2К',
    photo_url: chicago
  },
  {
    id: 2,
    author: 'Михаил',
    avatar_url: michael,
    date: 'час назад',
    latlng: [59.94, 30.32],
    category: Categories.PHOTO,
    emotion: Emotions.SAD,
    likes_count: 65,
    comments_count: 65,
    reposts_count: 4,
    views_count: '7,2К',
    text: '«Убийство Роджера Экройда» (англ. The Murder of Roger Ackroyd) — детективный роман Агаты Кристи, опубликованный в 1926 году. Является шестым изданным романом писательницы и третьим, в котором фигурирует детектив Эркюль Пуаро.'
  },
];