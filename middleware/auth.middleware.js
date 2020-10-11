// это промежуточный слой между браузером и сервером когда происходит запрос на сервер, гет или пост
const jwt = require('jsonwebtoken'); //для раскодировки токена ниже
const config = require('config'); // содержит переменную jwt secret 

module.exports = (req, res, next) => {
    
    if (req.method === 'OPTIONS') {
        return next()   //перед гет или пост запросом всегда отправляется OPTIONS на сервет, т.е. сервер вообще доступен, если true то продолжаем запрос
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN" если  у запроса есть  token то в хедеосах есть такая строка "Bearer TOKEN", с помощью сплита мы ее получаем
             if (!token) {
                 return res.status(401).json({message: 'There is no authorization1111'})
             }

             const decoded = jwt.verify(token, config.get('jwtSecret'))   //если Токен есть его нужно раскодировать. используем метод verify для раскодировки токена, но вторым параметром нужно указать ключ который был использован для формирования токенаSecretToken from config
             req.user = decoded;   //в глобальном объекте req создали поле user  и положили в него раскодированный токен
             
             next()

    } catch (error) {
        res.status(401).json({message: 'There is no authorization general catch'})
    }
}