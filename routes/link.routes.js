// здесь организовывается роутер
const {Router} = require('express') //подключили экспресс, взяли из него роутер
const Link = require('../models/Link')  // подключили модель
const authMiddleware = require('../middleware/auth.middleware') // подключил промежуточный слой для получения токена перед запросом
const shortid = require('shortid')
const config = require('config')
const router = Router()   // создали роутер из функции Роутер

// обрабатываем запросы

// генерируем ссылки
 // authMiddleware который создан в отдельной папке нужен для того чтоб в объекте req. появиля user с раскодированным jwt token в котором хранится userId
router.post('/generate', authMiddleware, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl')
        const { from } = req.body

        const code = shortid.generate()

        const existing = await Link.findOne({ from })

        if (existing) {
           return res.json({ link: existing })
        }

        const to = `${baseUrl}/t/${code}`

        const link = new Link({   // new Link т.к. у нас модель для БД монго Link
            code, to, from, owner: req.user.userId
        }) 

        await link.save()     // отправили запрос в БД для сохранения ссылки
        res.status(201).json({link})


    } catch (e) {
        res.status(500).json({message: 'Something goes wrong link'})
    }
})

// получаем все  ссылки
router.get('/', authMiddleware, async (req, res) => {
    try {
        // authMiddleware который создан в отдельной папке нужен для того чтоб в объекте req. появиля user с раскодированным jwt token в котором хранится userId
        const links = await Link.find({ owner: req.user.userId}) // делаем запрос в базу монго через модель Link где мы ищем все ссылки данного пользователя userId
        res.json(links)
    } catch (e) {
        res.status(500).json({message: 'Something goes wrong link'})
    }
})

// получаем ссылки по id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id) //получаем  из модели Link конкретную сыылку которая пришла в реквест по id
        res.json(link)
    } catch (e) {
        res.status(500).json({message: 'Something goes wrong link'})
    }
})

module.exports = router
