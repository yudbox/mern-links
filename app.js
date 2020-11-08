const express = require('express');
const config = require('config'); //подключили библиотеку config для работы с конфиг данными
const mongoose = require('mongoose') // подключили библтотеку mongo
const path = require('path')

const app = express();
//это встроенный в express промежуточный слой который проверяет body при POST запросе на сервер req.body на тип (json) и
// фильтрует другие дополнительные параметры
app.use(express.json({ type: "application/json"}))

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     next();
//   });

//здесь мы подклучаем мидлваре для созданных роутов
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

//заливаем на хостинг если это продакшн запускаем метод static() который указывает где находятся статические файлы приложения
// и второй параметр все GET запросы перенаправлять на файл index.html 
if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


const PORT = config.get('port') || 5000;
const start =  async () => {
    try{
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true

        })
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit();    //у node js есть глобальный процесс process в котором есть метод exit

    }
}

start();



