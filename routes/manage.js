const express = require('express');
const router = express.Router();
const db = require('../config/database');

Category = require('../models/Category.js');

// MANAGE - GET
router.get('/', (req, res, next) =>{
    res.render('manage', {title: `Panel d'administration`});
});


// MANAGE ARTICLES - GET
router.get('/articles', async (req, res, next) =>{

    const results = await db.promise().query(`SELECT * FROM articles`);
    let articles = [];
        for(i=0; i < results[0].length; i++){
            article = {
                'id':results[0][i].id,
                'titre':results[0][i].title,
            }
            articles.push(article);
        }
    res.render('manage_articles', {title: 'Gérer les articles', articles});
});

// ADD ARTICLE - GET
router.get('/articles/add', (req, res, next) =>{
    res.render('add_article', {title: 'Ajouter un article'});
});

// EDIT ARTICLE - GET
router.get('/articles/edit/:id', async (req, res, next) =>{
    const results = await db.promise().query(`SELECT content, author, title, photo_mini FROM articles WHERE id = ${req.params.id}`);
            article = {
                'id':req.params.id,
                'contenu':results[0][0].content,
                'auteur': results[0][0].author,
                'titre': results[0][0].title,
                'lien': results[0][0].photo_mini
            }
    res.render('edit_article', {title: 'Éditer un article', article});
});


// MANAGE EVENEMENTS - GET
router.get('/evenements', async (req, res, next) =>{
    const results = await db.promise().query(`SELECT * FROM events`);
    let evenements = [];
        for(i=0; i < results[0].length; i++){
            evenement = {
                'id':results[0][i].id,
                'titre':results[0][i].title,
            }
            evenements.push(evenement);
        }
    res.render('manage_evenements', {title: 'Gérer les évènements', evenements});
});

// ADD EVENT - GET
router.get('/evenements/add', (req, res, next) =>{
    res.render('add_evenement', {title: 'Ajouter un évènement'});
});

// EDIT EVENT - GET
router.get('/evenements/edit/:id', async (req, res, next) =>{
    const results = await db.promise().query(`SELECT id, title, description, date, heure, ticket, photo_mini FROM events WHERE id = ${req.params.id}`);
        evenement = {
                'id':req.params.id,
                'titre': results[0][0].title,
                'description':results[0][0].description,
                'date': results[0][0].date,
                'heure': results[0][0].heure,
                'ticket': results[0][0].ticket,
                'lien': results[0][0].photo_mini
            }
    res.render('edit_evenement', {title: 'Éditer un évènement', evenement});
});



// MANAGE GALLERY - GET
router.get('/galerie', async (req, res, next) =>{
    const results = await db.promise().query(`SELECT * FROM gallery`);
    let photos = [];
        for(i=0; i < results[0].length; i++){
            photo = {
                'id':results[0][i].id,
                'lien':results[0][i].photo_mini,
            }
            photos.push(photo);
        }
    res.render('manage_galerie', {title: 'Gérer la galerie', photos});
});

// ADD A PHOTO (GALLERY) - GET
router.get('/galerie/add', (req, res, next) =>{
    res.render('add_galerie', {title: 'Ajouter une photo'});
});

// EDIT EVENT - GET
router.get('/galerie/edit/:id', async (req, res, next) =>{
    const results = await db.promise().query(`SELECT comment, photo_small FROM gallery WHERE id = ${req.params.id}`);
            photo = {
                'id':req.params.id,
                'commentaire': results[0][0].comment,
                'lien': results[0][0].photo_small
            }

    res.render('edit_galerie', {title: 'Modifier une photo', photo});
});

// MANAGE INDEX WALLPAPER - GET
router.get('/header', async (req, res, next) =>{
    const results = await db.promise().query(`SELECT photo_small FROM header`);
    console.log(results[0][0]);
    header = {
        'lien': results[0][0].photo_small
    }
    res.render('edit_header', {title: "Changer le fond d'écran d'accueil", header});
});


module.exports = router;