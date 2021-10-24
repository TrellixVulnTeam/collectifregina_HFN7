const express = require('express');
const router = express.Router();
const db = require('../config/database');
const path = require('path');

const sharp = require('sharp');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage })
const fs = require('fs');
const { uuid } = require('uuidv4');

// Page Galerie
router.get('/', (req, res, next) =>{
    res.render('galerie');
});

// ADD PHOTO - POST
router.post('/add', upload.single('image'), async (req, res) => {
    const id = uuid();
    const fileName = function(item){
        return `/img/galerie/${id}${item}.jpg`
    }
    if(req.file){
        await sharp(req.file.buffer).resize({width: 150}).toFile(`public/${fileName('-mini')}`);
        await sharp(req.file.buffer).resize({width: 500}).toFile(`public/${fileName('-small')}`);
        await sharp(req.file.buffer).resize({width: 1000}).toFile(`public/${fileName('-small-2x')}`);
        await sharp(req.file.buffer).resize({width: 1000}).toFile(`public/${fileName('')}`);
        await sharp(req.file.buffer).resize({width: 2000}).toFile(`public/${fileName('-2x')}`);
        await sharp(req.file.buffer).toFile(`public/${fileName('-big')}`);
    } else  {
        return;
    }

    const { commentaire } = req.body;
    const comment = `${commentaire ? commentaire : ''}`

    try {
        db.promise().query(`INSERT INTO gallery VALUES(NULL, "${comment}", '${fileName('-small')}', '${fileName('')}', '${fileName('-big')}', '${fileName('-small-2x')}', '${fileName('-2x')}', '${fileName('-mini')}')`);
        res.status(201); 
    }
    catch(err) {
        console.log(err);
    }
    res.redirect('/manage/galerie');
})

// EDIT PHOTO - POST
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    const id = uuid();
    const fileName = function(item){
        return `/img/galerie/${id}${item}.jpg`
    }

    const { commentaire } = req.body;
    console.log(commentaire);

        if (!req.file){

            try {
                const comment = `${commentaire ? commentaire : ''}`

                await db.promise().query(`UPDATE gallery SET comment="${comment}" WHERE id = ${req.params.id}`);

            } catch(err){
                console.log(err);
            }

        } else if (req.file) {

            try {
                // On crée et on sauvegarde les nouvelles images sur le serveur
                await sharp(req.file.buffer).resize({width: 150}).toFile(`public/${fileName('-mini')}`);
                await sharp(req.file.buffer).resize({width: 500}).toFile(`public/${fileName('-small')}`);
                await sharp(req.file.buffer).resize({width: 1000}).toFile(`public/${fileName('-small-2x')}`);
                await sharp(req.file.buffer).resize({width: 1000}).toFile(`public/${fileName('')}`);
                await sharp(req.file.buffer).resize({width: 2000}).toFile(`public/${fileName('-2x')}`);
                await sharp(req.file.buffer).toFile(`public/${fileName('-big')}`);

                // On supprime les images existantes de l'article
                const results = await db.promise().query(`SELECT photo_small, photo_medium, photo_big, photo_small_2x, photo_medium_2x, photo_mini FROM gallery WHERE id = ${req.params.id}`)
                Object.values(results[0][0]).forEach(val => {
                        fs.unlink(`public${val}`, (err) =>{
                            console.log('Photo deleted', val);
                            if(err) {
                                console.error(err);
                                return
                            }
                        })
                });

                // On actualise la base de données 
                const comment = `${commentaire ? commentaire : ''}`

                await db.promise().query(`UPDATE gallery
                SET comment="${comment}",
                photo_small='${fileName('-small')}', 
                photo_medium='${fileName('')}', 
                photo_small_2x='${fileName('-small-2x')}', 
                photo_medium_2x='${fileName('-2x')}',
                photo_mini='${fileName('-mini')}'
                WHERE id = ${req.params.id}`);

                res.status(201); 
            }
            catch(err) {
                console.log(err);
            }
        }
        res.redirect('/manage/galerie');
})

// DELETE PHOTO 
router.delete('/delete/:id', async (req, res, next) =>{
    try {
        await db.promise().query(`DELETE FROM gallery WHERE id='${req.params.id}'`);
    }
    catch(err) {
        console.log(err);
    }
})


module.exports = router;