# Bepis | Карта эмоций. Веб

## Ядро и конфигурация
Все записи в приложении генерируются функциями из `/web/src/api/api.js` случайным образом, используя данные, хранящиеся в директории `/web/src/data`.
Внутри файла `/web/src/consts/config.js` хранятся 2 основные постоянные конфигурации:
1. `DEFAULT_GENERATED_POSTS_COUNT` - количество генерируемых записей по умолчанию (default: 250)
2. `DEFAULT_GENERATED_POSTS_RADIUS` - разброс генерируемых записей по карте по умолчанию (default: 0.05)

## Главные фичи
1. Генерация случайных постов при инициализации приложения
2. Темная тема
3. Список отображаемых категорий на карте в футере отсортирован по уменьшению кол-ва записей данной пары категория-эмоция
4. Анимации фильтров настроения
5. Кластеризация
6. Эффективная комбинированная фильтрация текстовым поиском и выбором конкретного настроения
7. Сохранение состояния карты при переходе на панель просмотра записей
8. Отображение актуальных записей при выборе кластера
9. Использование лишь одной дополнительной open-source библиотеки Leaflet для отрисовки карты