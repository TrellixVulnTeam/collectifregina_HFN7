const express = require('express');
const router = express.Router();
const db = require('../config/database');

const sharp = require('sharp');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage })
const fs = require('fs');


// EDIT EVENT - POST
router.post('/edit', upload.single('image'), async (req, res) =>{
    const fileName = function(item){
        return `/img/index/header${item}.jpg`
    }

        if (req.file) {
            try {
                
                // On supprime les images existantes de l'article
                const results = await db.promise().query(`SELECT photo_small, photo_medium, photo_small_2x, photo_medium_2x FROM header`)
                Object.values(results[0][0]).forEach(val => {
                    fs.unlink(`public${val}`, (err) =>{
                        console.log('Photo deleted', val);
                        if(err) {
                            console.error(err);
                            return
                        }
                    })
                });
                
                // On crée et on sauvegarde les nouvelles images sur le serveur
                await sharp(req.file.buffer).resize({width: 440}).toFile(`public/${fileName('-small')}`);
                await sharp(req.file.buffer).resize({width: 1000}).toFile(`public/${fileName('')}`);
                await sharp(req.file.buffer).resize({width: 880}).toFile(`public/${fileName('-small-2x')}`);
                await sharp(req.file.buffer).resize({width: 2000}).toFile(`public/${fileName('-2x')}`);

                // On actualise la base de données 
                await db.promise().query(`UPDATE header
                SET photo_small='${fileName('-small')}', 
                photo_medium='${fileName('')}', 
                photo_small_2x='${fileName('-small-2x')}', 
                photo_medium_2x='${fileName('-2x')}'`),

                res.status(201); 
            }
            catch(err) {
                console.log(err);
            }
        }
        res.redirect('/manage');
})

module.exports = router;