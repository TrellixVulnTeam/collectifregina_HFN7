const express = require('express');
const router = express.Router();
const db = require('../config/database');

const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre'
]

router.get('/:id', async (req, res, next) => {
        try {
            const results = await db.promise().query(`SELECT content, author, title, date, photo_big, photo_big_2x FROM articles WHERE id = ${req.params.id}`);
            const annee = results[0][0].date.split('/')[2];
            const mois = months[results[0][0].date.split('/')[1] - 1];
            const jour = results[0][0].date.split('/')[0];
            const date = `${jour} ${mois} ${annee}`
            console.log(date);

            article = {
                'contenu': results[0][0].content,
                'auteur': results[0][0].author,
                'titre': results[0][0].title,
                date,
                'photo_big': results[0][0].photo_big,
                'photo_big_2x': results[0][0].photo_big_2x,
            }
        } catch(err){
            console.log(err);
        }
        
    res.render('article', { article });
});



module.exports = router;