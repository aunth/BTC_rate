# Інструкція по запуску проекту

---

Цей проект є серверним додатком, який надає API для отримання поточного курсу Bitcoin до гривні (UAH), можливість підписки на отримання сповіщень про зміни ціни та можливість надсилання ціни по електронній пошті за розкладом.

## Вимоги

Перед початком роботи з цим проектом переконайтеся, що у вас встановлені наступні компоненти:

- Node.js: Для виконання JavaScript коду.
- Docker: Для створення та запуску контейнера з додатком.

## Інструкції

1. **Клонування репозиторію**

    Спочатку склонуйте репозиторій на свій комп'ютер. Відкрийте термінал та виконайте наступну команду:

    ```
    git clone <URL репозиторію>
    ```

2. **Зміна до директорії проекту**

    Перейдіть у директорію проекту:

    ```
    cd <назва папки проекту>
    ```

3. **Встановлення залежностей**

    Виконайте команду для встановлення всіх необхідних залежностей:

    ```
    npm install
    ```

4. **Запуск Docker контейнера**

    Запустіть Docker контейнер, використовуючи наступні команди:

    ```
    docker build -t <ім'я образу> .
    docker run -p 3000:3000 <ім'я образу>
    ```

    Додаток буде доступний за адресою `http://localhost:3000`.

## Важливо

Перед запуском додатку переконайтеся, що ви встановили всі необхідні змінні середовища в файлі `.env`, вказавши вашу адресу Gmail та пароль для додатку, 

## Використання API

Після успішного запуску додатку ви можете користуватися наступними ендпоінтами:

- `GET /rate`: Отримати поточний курс Bitcoin до UAH.
- `POST /subscribe`: Підписатися на отримання сповіщень про зміни курсу.
- `POST /send-price`: Надіслати поточний курс по електронній пошті.

## Завершення

Це все! Тепер ви готові використовувати цей проект. Якщо у вас виникли питання або проблеми, будь ласка, зв'яжіться з нами. Бажаємо успіху у вашому використанні!
