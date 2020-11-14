const {Router} = require('express');
const router = Router();
const Link = require('../models/Link')  // подключили модель

// тк путь будет формироваться динамически пишем :code
router.get('/:code', async (req, res) => {
    try {
        
        const link = await Link.findOne({ code: req.params.code }) //req.params появится тк код :code динамический
        //если ссылка есть мы проводим аналитику. т.е. подсчитываем количество кликов
        // потом тправляем клик в БД и после этого делаем редирект по этой ссылке
        if (link) {
            link.clicks++
            await link.save()
            return res.redirect(link.from)
        }

        res.status(404).json('Link not found12')

    } catch (error) {
        res.status(500).json({message: 'Something goes wrong linkredirect'})
    }
})

module.exports = router