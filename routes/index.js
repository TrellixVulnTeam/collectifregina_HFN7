const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res, next) =>{
    const months = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre'
    ]
    
    let evenements = [];
    let articles = [];
    let photos = [];
    
    try {
        const resultsEvents = await db.promise().query(`SELECT title, date, description, photo_small, photo_small_2x FROM events ORDER by date DESC LIMIT 3`);
            for(i=0; i <= 2; i++){
                const mois = months[resultsEvents[0][i].date.split('-')[1] - 1];
                const jour = resultsEvents[0][i].date.split('-')[2];

                const evenement = {
                    'titre':resultsEvents[0][i].title,
                    mois,
                    jour,
                    'description':resultsEvents[0][i].description,
                    'photo_small':resultsEvents[0][i].photo_small,
                    'photo_small_2x':resultsEvents[0][i].photo_small_2x,
                }
                evenements.push(evenement);
            }

        const resultsArticles = await db.promise().query(`SELECT id, title, content, photo_small, photo_small_2x FROM articles ORDER by date DESC LIMIT 3`);
            for(i=0; i <= 2; i++){
                const description = resultsArticles[0][i].content.substring(0,250) + '[...]';
                const article = {
                    'id':resultsArticles[0][i].id,
                    'titre':resultsArticles[0][i].title,
                    description,
                    'photo_small':resultsArticles[0][i].photo_small,
                    'photo_small_2x':resultsArticles[0][i].photo_small_2x,
                }
                articles.push(article);
            }

        const resultsGallery = await db.promise().query(`SELECT photo_small, photo_small_2x FROM gallery ORDER by id LIMIT 4`);
            for(i=0; i <= 3; i++){
                const photo = {
                    'photo_small': resultsGallery[0][i].photo_small,
                    'photo_small_2x': resultsGallery[0][i].photo_small_2x,
                }
                photos.push(photo);
            }
    } catch(err) {
        console.log(err);
    }
    res.render('index', { evenements, articles, photos });
});


module.exports = router;