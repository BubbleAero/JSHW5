# language: ru

Функционал: Бронирование билетов на фильмы

Сценарий: Бронирование билета на фильм '"Сталкер(1979)"'
Дано пользователь на странице "http://qamid.tmweb.ru/client/index.php"
Когда переход на расписание следующего дня
Когда выбор сеанса фильма Сталкер на 13-00
Когда выбор места в зале 1 ряд 6 место
Тогда результат бронирования

Сценарий: Покупка нескольких билетов на фильм "Сталкер(1979)" через 4 дня после текущей даты
Дано пользователь на странице "http://qamid.tmweb.ru/client/index.php"
Когда переход на расписание через 4 дня от текущей даты
Когда выбор сеанса фильма Сталкер на 13-00
Когда выбор места в зале 5 ряд 5, 6 места
Тогда результат бронирования двух билетов

Сценарий: Покупка билета и попытка бронирования занятого места
Дано пользователь на странице "http://qamid.tmweb.ru/client/index.php"
Когда переход на расписание через 4 дня от текущей даты
Когда выбор сеанса фильма Сталкер на 13-00
Когда выбор места в зале 5 ряд 5, 6 места
Тогда покупка билета


Когда переход на главную страницу кинотеатра "http://qamid.tmweb.ru/client/index.php"
Когда переход на расписание через 4 дня от текущей даты
Когда выбор сеанса фильма Сталкер на 13-00
Тогда результат бронирования места, которое занято

Сценарий: Неуспешное бронирование билета на утренний сеанс сегодняшнего дня в обед
Дано пользователь на странице "http://qamid.tmweb.ru/client/index.php"
Когда пользователь выбирает в обед утренний сеанс текущего дня
Тогда бронирование невозможно на неактивный сеанс 