# Node.js клиент для Notify.Events

Простая Node.js-библиотека, которая призвана упростить процесс интеграции сервиса [Notify.Events](https://notify.events) в ваш проект,  с целью отправки сообщений в созданный канал.

#### Инструкции на других языках

- [English](/README.md)

# Установка

Рекомендуется производить установку библиотеки через пакетный менеджер [npm](https://www.npmjs.com/get-npm).

Для этого, либо запустите

```
npm install @notify.events/nodejs
```

либо добавьте

```
"@notify.events/nodejs": "~1.0"
```

в секцию dependencies вашего package.json файла.

# Использование

Для использования этой библиотеки, вам необходимо подключить класс Message в ваш Node.js-скрипт.

Если для установки вы использовали npm, будет достаточно подключить библиотеку по названию:

```nodejs
const Message = require('@notify.events/nodejs').Message;
```

В случае, если библиотеку вы добавляли вручную, вам необходимо импортировать класс Message, указав полный путь: 

```nodejs
const Message = require('./path/to/your/Message');
```

После этого вы можете создать объект сообщения, установить необходимые параметры и отправить сообщение в канал.

### Пример использования

```nodejs
const Message = require('@notify.events/nodejs').Message;

// Определяем токен канала.
// Этот токен вы получаете при создании канала на сервисе Notify.Events.
const token = 'XXXXXXXX';

// Создаём объект сообщения.
const message = new Message('Some <b>important</b> message', 'Title', Message.PRIORITY_HIGH, Message.LEVEL_ERROR);

// Прикрепляем файл к сообщению.
message.addFile('path\to\local\file');

// Отправляем сообщение на свой канал в Notify.Events.
message.send(token);
```