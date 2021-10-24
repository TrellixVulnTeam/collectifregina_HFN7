const express = require('express');
const router = express.Router();
const db = require('../config/database');

const sharp = require('sharp');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage })
const fs = require('fs');
const { uuid } = require('uuidv4');


router.get('/', async (req, res, next) =>{
    let articles = []

    try {
        const resultsArticles = await db.promise().query(`SELECT id, title, author, content, photo_small, photo_small_2x FROM articles ORDER by date DESC`);
        for(i=1; i < resultsArticles[0].length ; i++){
            const description = resultsArticles[0][i].content.substring(0,250) + '[...]';
            const article = {
                'id':resultsArticles[0][i].id,
                'titre':resultsArticles[0][i].title,
                description,
                'photo_small':resultsArticles[0][i].photo_small,
                'photo_small_2x':resultsArticles[0][i].photo_small_2x,
            }
            articles.push(article);
            articles.reverse();
        }

        const resultsLastArticle = await db.promise().query(`SELECT id, title, author, content, photo_medium, photo_medium_2x FROM articles ORDER by date DESC LIMIT 1`);
            const description = resultsLastArticle[0][0].content.substring(0,250) + '[...]';
            const lastArticle = {
                'id':resultsLastArticle[0][0].id,
                'titre':resultsLastArticle[0][0].title,
                'auteur':resultsLastArticle[0][0].author,
                description,
                'photo_medium':resultsLastArticle[0][0].photo_medium,
                'photo_medium_2x':resultsLastArticle[0][0].photo_medium_2x,
            }
        res.render('articles', { articles, lastArticle });

    } catch(err){
        console.log(err);
    }

});


// ADD ARTICLE - POST
router.post('/add', upload.single('image'), async (req, res) => {

        const id = uuid();
        const fileName = function(item){
            return `/img/articles/${id}${item}.jpg`
        }

        await sharp(req.file.buffer).resize({width: 200}).toFile(`public/${fileName('-mini')}`);
        await sharp(req.file.buffer).resize({width: 440}).toFile(`public/${fileName('-small')}`);
        await sharp(req.file.buffer).resize({width: 1000}).toFile(`public/${fileName('')}`);
        await sharp(req.file.buffer).resize({width: 1920}).toFile(`public/${fileName('-big')}`);
        await sharp(req.file.buffer).resize({width: 880}).toFile(`public/${fileName('-small-2x')}`);
        await sharp(req.file.buffer).resize({width: 2000}).toFile(`public/${fileName('-2x')}`);
        await sharp(req.file.buffer).resize({width: 3840}).toFile(`public/${fileName('-big-2x')}`);
    const { contenu, auteur, titre } = req.body;

    const d = new Date();
    const day = `${d.getDate()}`.padStart(2, '0');
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const year = d.getFullYear();
    const date = `${day}/${month}/${year}`;
    console.log(date);

        if (contenu && auteur && titre && req.file){
        try {
            db.promise().query(`INSERT INTO articles VALUES(NULL, "${contenu}", "${auteur}", "${titre}", "${date}", '${fileName('-small')}', '${fileName('')}', '${fileName('-big')}', '${fileName('-small-2x')}', '${fileName('-2x')}', '${fileName('-big-2x')}', '${fileName('-mini')}')`);
            res.status(201); 
        }
        catch(err) {
            console.log(err);
        }
    }
    res.redirect('/manage/articles');
});

// EDIT ARTICLE - POST
router.post('/edit/:id', upload.single('image'), async (req, res) =>{
    const id = uuid();
    const fileName = function(item){
        return `/img/articles/${id}${item}.jpg`
    }

    const { contenu, auteur, titre } = req.body;
        if (contenu && auteur && titre && !req.file){
            try {
                db.promise().query(`UPDATE articles SET title='${titre}', author='${auteur}', content='${contenu}' WHERE id = ${req.params.id}`);
                res.status(201); 
            }

            catch(err) {
                console.log(err);
            }

        } else if(contenu && auteur && titre && req.file) {
            try {
                // On crée et on sauvegarde les nouvelles images sur le serveur
                await sharp(req.file.buffer).resize({width: 200}).toFile(`public/${fileName('-mini')}`);
                await sharp(req.file.buffer).resize({width: 440}).toFile(`public/${fileName('-small')}`);
                await sharp(req.file.buffer).resize({width: 1000}).toFile(`public/${fileName('')}`);
                await sharp(req.file.buffer).resize({width: 1920}).toFile(`public/${fileName('-big')}`);
                await sharp(req.file.buffer).resize({width: 880}).toFile(`public/${fileName('-small-2x')}`);
                await sharp(req.file.buffer).resize({width: 2000}).toFile(`public/${fileName('-2x')}`);
                await sharp(req.file.buffer).resize({width: 3840}).toFile(`public/${fileName('-big-2x')}`);

                // On supprime les images existantes de l'article
                const results = await db.promise().query(`SELECT photo_small, photo_medium, photo_big, photo_small_2x, photo_medium_2x, photo_big_2x, photo_mini FROM articles WHERE id = ${req.params.id}`)
                Object.values(results[0][0]).forEach(val => {
                        fs.unlink(`public${val}`, (err) =>{
                            if(err) {
                                console.error(err);
                                return
                            }
                        })
                });


                // On actualise la base de données 
                await db.promise().query(`UPDATE articles 
                SET title='${titre}', 
                author='${auteur}', 
                content='${contenu}', 
                photo_small='${fileName('-small')}', 
                photo_medium='${fileName('')}', 
                photo_big='${fileName('-big')}', 
                photo_small_2x='${fileName('-small-2x')}', 
                photo_medium_2x='${fileName('-2x')}', 
                photo_big_2x='${fileName('-big-2x')}',
                photo_mini='${fileName('-mini')}'
                WHERE id = ${req.params.id}`);

                res.status(201); 
            }
            catch(err) {
                console.log(err);
            }
        }
        res.redirect('/manage/articles');
})

// DELETE ARTICLE - DELETE
router.delete('/delete/:id', async (req, res, next) =>{
    try {
        await db.promise().query(`DELETE FROM articles WHERE id='${req.params.id}'`);
    }
    catch(err) {
        console.log(err);
    }
})


module.exports = router;