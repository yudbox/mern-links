const {Router} = require('express');
const router = Router();
const Link = require('../models/Link')  // подключили модель

// тк путь будет формироваться динамически пишем :code
router.get('/:code', async (req, res) => {
    try {
        
        const link = await Link.findOne({ code: req.params.code }) //req.params появится тк код :code динамический

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