/* eslint-disable max-len */
export const RESULT_CODE = {
  API_CONNECTION_ERROR: 'API_CONNECTION_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  BOOKINGS_REJECTED: 'BOOKINGS_REJECTED',
  BOOKING_ADDED: 'BOOKING_ADDED',
  BOOKING_ALREADY_EXISTS: 'BOOKING_ALREADY_EXIST',
  BOOKING_APPROVED: 'BOOKING_APPROVED',
  BOOKING_COMMENTED: 'BOOKING_COMMENTED',
  BOOKING_DEMO_CLIENT: 'BOOKING_DEMO_CLIENT',
  BOOKING_DEMO_OWNER: 'BOOKING_DEMO_OWNER',
  BOOKING_NOT_FOUND: 'BOOKING_NOT_FOUND',
  BOOKING_NO_VALID_DATE: 'BOOKING_NO_VALID_DATE',
  BOOKING_NO_VALID_TIMEZONE: 'BOOKING_NO_VALID_TIMEZONE',
  DB_CONNECTION_ERROR: 'DB_CONNECTION_ERROR',
  INCORRECT_INPUT_PARAMS: 'INCORRECT_INPUT_PARAMS',
  JSON_PARSING_ERROR: 'JSON_PARSING_ERROR',
  LOCAL_IS_NOT_MAIN_STRATEGY: 'LOCAL_IS_NOT_MAIN_STRATEGY',
  LOGGED_OUT: 'LOGGED_OUT',
  NO_AUTH: 'NO_AUTH',
  OFFICE_ADDED: 'OFFICE_ADDED',
  OFFICE_DELETED: 'OFFICE_DELETED',
  OFFICE_NOT_FOUND: 'OFFICE_NOT_FOUND',
  OFFICE_NOT_VERIFIED: 'OFFICE_NOT_VERIFIED',
  OFFICE_UPDATED: 'OFFICE_UPDATED',
  OFFLINE: 'OFFLINE',
  PAYMENT_ADDED: 'PAYMENT_ADDED',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  ROOM_ADDED: 'ROOM_ADDED',
  ROOM_DELETED: 'ROOM_DELETED',
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_UPDATED: 'ROOM_UPDATED',
  TARIFF_NOT_APPLIED: 'TARIFF_NOT_APPLIED',
  TARIFF_NOT_APPLIED_USER: 'TARIFF_NOT_APPLIED_USER',
};

export const RESULT_MESSAGE = {
  en:{
    [RESULT_CODE.API_CONNECTION_ERROR]: 'API connection error - please check internet connection',
    [RESULT_CODE.BAD_REQUEST]: 'Incorrect data - please check the values of necessary fields (marked with red star)',
    [RESULT_CODE.BOOKINGS_REJECTED]: 'Bookings rejected',
    [RESULT_CODE.BOOKING_ADDED]: 'Booking added successfully',
    [RESULT_CODE.BOOKING_ALREADY_EXISTS]: 'This time is already booked',
    [RESULT_CODE.BOOKING_APPROVED]: 'Booking approved',
    [RESULT_CODE.BOOKING_COMMENTED]: 'Booking comment updated successfully',
    [RESULT_CODE.BOOKING_DEMO_CLIENT]: 'Please recommend office owner "Booking" tariff free trial',
    [RESULT_CODE.BOOKING_DEMO_OWNER]: 'You can try booking function in "Booking" tariff free trial',
    [RESULT_CODE.BOOKING_NOT_FOUND]: 'Booking not found',
    [RESULT_CODE.BOOKING_NO_VALID_DATE]: 'Date is not valid',
    [RESULT_CODE.BOOKING_NO_VALID_TIMEZONE]: 'Timezone is not valid',
    [RESULT_CODE.DB_CONNECTION_ERROR]: 'DB connection error',
    [RESULT_CODE.INCORRECT_INPUT_PARAMS]: 'Incorrect input params',
    [RESULT_CODE.JSON_PARSING_ERROR]: 'JSON parsing error',
    [RESULT_CODE.LOCAL_IS_NOT_MAIN_STRATEGY]: 'Use Google button for this e-mail',
    [RESULT_CODE.LOGGED_OUT]: 'Logged out',
    [RESULT_CODE.NO_AUTH]: 'Authorization required',
    [RESULT_CODE.OFFICE_ADDED]: 'Office added successfully',
    [RESULT_CODE.OFFICE_DELETED]: 'Office was successfully deleted',
    [RESULT_CODE.OFFICE_NOT_FOUND]: 'Specified office was not found in database',
    [RESULT_CODE.OFFICE_NOT_VERIFIED]: 'This office is not verified',
    [RESULT_CODE.OFFICE_UPDATED]: 'Office data updated successfully',
    [RESULT_CODE.OFFLINE]: 'You are offline',
    [RESULT_CODE.PAYMENT_ADDED]: 'Payment completed successfully',
    [RESULT_CODE.PAYMENT_ERROR]: 'Payment error',
    [RESULT_CODE.PERMISSION_DENIED]: 'Permission denied',
    [RESULT_CODE.ROOM_ADDED]: 'Room added successfully',
    [RESULT_CODE.ROOM_DELETED]: 'Room successfully deleted',
    [RESULT_CODE.ROOM_NOT_FOUND]: 'Specified room was not found in database',
    [RESULT_CODE.ROOM_UPDATED]: 'Room data updated successfully',
    [RESULT_CODE.TARIFF_NOT_APPLIED]: 'None of the tariffs have been applied',
    [RESULT_CODE.TARIFF_NOT_APPLIED_USER]: 'Please ask website owner to apply one of the tariffs',
  },
  uk:{
    [RESULT_CODE.API_CONNECTION_ERROR]: 'Помилка підключення API - перевірте підключення до iнтернету',
    [RESULT_CODE.BAD_REQUEST]: 'Хибні дані - будь ласка, перевірте значення необхідних полів (позначені червоною зіркою)',
    [RESULT_CODE.BOOKINGS_REJECTED]: 'Бронювання відхилене',
    [RESULT_CODE.BOOKING_ADDED]: 'Бронювання додано успішно',
    [RESULT_CODE.BOOKING_ALREADY_EXISTS]: 'Бронювання на цей час вже існує',
    [RESULT_CODE.BOOKING_APPROVED]: 'Бронювання ухвалено',
    [RESULT_CODE.BOOKING_COMMENTED]: 'Коментарiй до бронювання успішно оновлено',
    [RESULT_CODE.BOOKING_DEMO_CLIENT]: 'Будь ласка, порадьте власнику офіса безкоштовно спробувати тариф "Бронювання"',
    [RESULT_CODE.BOOKING_DEMO_OWNER]: 'Ви можете безкоштовно спробувати бронювання через сайт у тарифi "Бронювання"',
    [RESULT_CODE.BOOKING_NOT_FOUND]: 'Бронювання не знайдено',
    [RESULT_CODE.BOOKING_NO_VALID_DATE]: 'Помилка у датi',
    [RESULT_CODE.BOOKING_NO_VALID_TIMEZONE]: 'Помилка у часовому поясі',
    [RESULT_CODE.DB_CONNECTION_ERROR]: 'Помилка підключення БД',
    [RESULT_CODE.INCORRECT_INPUT_PARAMS]: 'Помилка вхідних параметрiв',
    [RESULT_CODE.JSON_PARSING_ERROR]: 'Помилка розбору JSON',
    [RESULT_CODE.LOCAL_IS_NOT_MAIN_STRATEGY]: 'Cкористуйтесь кнопкою Google для цього e-mail',
    [RESULT_CODE.LOGGED_OUT]: 'Вихiд успiшний',
    [RESULT_CODE.NO_AUTH]: 'Потрiбна авторизацiя',
    [RESULT_CODE.OFFICE_ADDED]: 'Офіс успішно створено',
    [RESULT_CODE.OFFICE_DELETED]: 'Офіс успішно видалено',
    [RESULT_CODE.OFFICE_NOT_FOUND]: 'Зазначений офіс не був знайдений у базі даних',
    [RESULT_CODE.OFFICE_NOT_VERIFIED]: 'Цей офіс не перевірено',
    [RESULT_CODE.OFFICE_UPDATED]: 'Дані офісу успішно оновлено',
    [RESULT_CODE.OFFLINE]: 'Ви поза мережею',
    [RESULT_CODE.PAYMENT_ADDED]: 'Оплату завершено успішно',
    [RESULT_CODE.PAYMENT_ERROR]: 'Пiд час оплати виникла помилка',
    [RESULT_CODE.PERMISSION_DENIED]: 'Доступ заборонено',
    [RESULT_CODE.ROOM_ADDED]: 'Кабінет успішно додано',
    [RESULT_CODE.ROOM_DELETED]: 'Кабінет успішно видалено',
    [RESULT_CODE.ROOM_NOT_FOUND]: 'Зазначений кабiнет не був знайдений у базі даних',
    [RESULT_CODE.ROOM_UPDATED]: 'Дані кабінету успішно оновлено',
    [RESULT_CODE.TARIFF_NOT_APPLIED]: 'Жоден з тарифiв не застосовано',
    [RESULT_CODE.TARIFF_NOT_APPLIED_USER]: 'Будь ласка, попросіть власника веб-сайту застосувати один із тарифів',
  },
  ru:{
    [RESULT_CODE.API_CONNECTION_ERROR]: 'Ошибка подключения API - проверьте подключение к интернету',
    [RESULT_CODE.BAD_REQUEST]: 'Ошибка в данных. Пожалуйста, проверьте значения обязательных полей (обозначенных красной звёздочкой)',
    [RESULT_CODE.BOOKINGS_REJECTED]: 'Бронирование отклонено',
    [RESULT_CODE.BOOKING_ADDED]: 'Бронирование успешно добавлено',
    [RESULT_CODE.BOOKING_ALREADY_EXISTS]: 'Бронирование на это время уже существует',
    [RESULT_CODE.BOOKING_APPROVED]: 'Бронирование одобрено',
    [RESULT_CODE.BOOKING_COMMENTED]: 'Коментарий к бронированию успешно обновлён',
    [RESULT_CODE.BOOKING_DEMO_CLIENT]: 'Пожалуйста, предложите владельцу офиса бесплатно попробовать тариф "Бронирование"',
    [RESULT_CODE.BOOKING_DEMO_OWNER]: 'Вы можете бесплатно попробовать бронирование через сайт в тарифе "Бронирование"',
    [RESULT_CODE.BOOKING_NOT_FOUND]: 'Бронирование не найдено',
    [RESULT_CODE.BOOKING_NO_VALID_DATE]: 'Ошибка в дате',
    [RESULT_CODE.BOOKING_NO_VALID_TIMEZONE]: 'Ошибка в часовом поясе',
    [RESULT_CODE.DB_CONNECTION_ERROR]: 'Ошибка подключения БД',
    [RESULT_CODE.INCORRECT_INPUT_PARAMS]: 'Ошибка входных параметров',
    [RESULT_CODE.JSON_PARSING_ERROR]: 'Ошибка разбора JSON',
    [RESULT_CODE.LOCAL_IS_NOT_MAIN_STRATEGY]: 'Используйте кнопку Google для этого e-mail',
    [RESULT_CODE.LOGGED_OUT]: 'Виход успешный',
    [RESULT_CODE.NO_AUTH]: 'Необходима авторизация',
    [RESULT_CODE.OFFICE_ADDED]: 'Офис успешно добавлен',
    [RESULT_CODE.OFFICE_DELETED]: 'Офис успешно удалён',
    [RESULT_CODE.OFFICE_NOT_FOUND]: 'Указанный офис не был найден в базе данных',
    [RESULT_CODE.OFFICE_NOT_VERIFIED]: 'Этот офис не проверен',
    [RESULT_CODE.OFFICE_UPDATED]: 'Данные офиса успешно обновлены',
    [RESULT_CODE.OFFLINE]: 'Вы вне сети',
    [RESULT_CODE.PAYMENT_ADDED]: 'Оплата прошла успешно',
    [RESULT_CODE.PAYMENT_ERROR]: 'Во время оплаты возникла ошибка',
    [RESULT_CODE.PERMISSION_DENIED]: 'Доступ запрещён',
    [RESULT_CODE.ROOM_ADDED]: 'Кабинет успешно добавлен',
    [RESULT_CODE.ROOM_DELETED]: 'Кабинет успешно удалён',
    [RESULT_CODE.ROOM_NOT_FOUND]: 'Указанный кабинет не был найден в базе данных',
    [RESULT_CODE.ROOM_UPDATED]: 'Данные кабинета успешно обновлены',
    [RESULT_CODE.TARIFF_NOT_APPLIED]: 'Ни один из тарифов не применен',
    [RESULT_CODE.TARIFF_NOT_APPLIED_USER]: 'Пожалуйста, попросите владельца сайта применить один из тарифов',
  },
};
