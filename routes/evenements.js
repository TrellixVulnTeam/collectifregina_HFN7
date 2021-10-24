const express = require('express');
const router = express.Router();
const db = require('../config/database');

const sharp = require('sharp');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage })
const fs = require('fs');
const { uuid } = require('uuidv4');

// Page évènements
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

    const monthsAbv = [
        'Janv.',
        'Févr.',
        'Mars',
        'Avr.',
        'Mai',
        'Juin',
        'Juill.',
        'Août',
        'Sept.',
        'Oct.',
        'Nov.',
        'Déc.'
    ]

    const evenementsPasses = [];
    const evenementsAVenir = [];
    
    const resultsEvents = await db.promise().query(`SELECT title, date, heure, description, photo_small, photo_small_2x, photo_medium, photo_medium_2x FROM events ORDER by date ASC`);
    for(i=0; i < resultsEvents[0].length ; i++){
        const mois = months[resultsEvents[0][i].date.split('-')[1] - 1];
        const moisAbv = monthsAbv[resultsEvents[0][i].date.split('-')[1] - 1];
        const jour = resultsEvents[0][i].date.split('-')[2];
        const annee = resultsEvents[0][i].date.split('-')[0];
        const tinyDate = `${jour} ${moisAbv}`

        const evenement = {
            'titre':resultsEvents[0][i].title,
            annee,
            mois,
            jour,
            tinyDate,
            'heure':resultsEvents[0][i].heure,
            'description':resultsEvents[0][i].description,
            'photo_small':resultsEvents[0][i].photo_small,
            'photo_small_2x':resultsEvents[0][i].photo_small_2x,
            'photo_medium':resultsEvents[0][i].photo_medium,
            'photo_medium_2x':resultsEvents[0][i].photo_medium_2x,
        }

        if(Number(Date.parse(resultsEvents[0][i].date) > Number(Date.now()))){
            evenementsAVenir.push(evenement);
        } else {
            evenementsPasses.push(evenement);
        }
    }
    evenementsPasses.reverse();

    res.render('evenements', { evenementsPasses, evenementsAVenir});
});

// ADD EVENT - POST 
router.post('/add', upload.single('image'), async (req, res) => {

        const id = uuid();
        const fileName = function(item){
            return `/img/evenements/${id}${item}.jpg`
        }

        await sharp(req.file.buffer).resize({width: 250}).toFile(`public/${fileName('-mini')}`);
        await sharp(req.file.buffer).resize({width: 350}).toFile(`public/${fileName('-small')}`);
        await sharp(req.file.buffer).resize({width: 700}).toFile(`public/${fileName('-small-2x')}`);
        await sharp(req.file.buffer).resize({width: 1000}).toFile(`public/${fileName('')}`);
        await sharp(req.file.buffer).resize({width: 2000}).toFile(`public/${fileName('-2x')}`);

    const { ticket, description, titre, date, heure } = req.body;

        if ( description && titre && date && heure && req.file){
            const isThereATicket = `${ticket ? ticket : ''}`
        try {
            db.promise().query(`INSERT INTO events VALUES(NULL, "${titre}", "${description}", "${date}", "${heure}", "${isThereATicket}", '${fileName('-small')}', '${fileName('')}', '${fileName('-small-2x')}', '${fileName('-2x')}', '${fileName('-mini')}')`);
            res.status(201); 
        }
        catch(err) {
            console.log(err);
        }
    }
    res.redirect('/manage/evenements');
});

// EDIT EVENT - POST
router.post('/edit/:id', upload.single('image'), async (req, res) =>{
    const id = uuid();
    const fileName = function(item){
        return `/img/evenements/${id}${item}.jpg`
    }

    const { ticket, description, titre, date, heure } = req.body;
        if (description && titre && date && heure && !req.file){
            const isThereATicket = `${ticket ? ticket : ''}`
            try {
                await db.promise().query(`UPDATE events SET title="${titre}", ticket="${isThereATicket}", date="${date}", heure="${heure}", description="${description}" WHERE id = ${req.params.id}`);
                res.status(201); 
            }

            catch(err) {
                console.log(err);
            }

        } 
        else if (ticket && description && titre && date && heure && req.file) {
            try {
                // On crée et on sauvegarde les nouvelles images sur le serveur
                await sharp(req.file.buffer).resize({width: 200}).toFile(`public/${fileName('-mini')}`);
                await sharp(req.file.buffer).resize({width: 440}).toFile(`public/${fileName('-small')}`);
                await sharp(req.file.buffer).resize({width: 1000}).toFile(`public/${fileName('')}`);
                await sharp(req.file.buffer).resize({width: 880}).toFile(`public/${fileName('-small-2x')}`);
                await sharp(req.file.buffer).resize({width: 2000}).toFile(`public/${fileName('-2x')}`);

                // On supprime les images existantes de l'article
                const results = await db.promise().query(`SELECT photo_small, photo_medium, photo_small_2x, photo_medium_2x FROM events WHERE id = ${req.params.id}`)
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
                await db.promise().query(`UPDATE events
                SET title="${titre}",
                ticket="${ticket}",
                date="${date}",
                heure="${heure}",
                description="${description}",
                photo_small='${fileName('-small')}', 
                photo_medium='${fileName('')}', 
                photo_small_2x='${fileName('-small-2x')}', 
                photo_medium_2x='${fileName('-2x')}',
                photo_mini = '${fileName('-mini')}'
                WHERE id = ${req.params.id}`);

                res.status(201); 
            }
            catch(err) {
                console.log(err);
            }
        }
        res.redirect('/manage/evenements');
})

// DELETE ARTICLE - DELETE
router.delete('/delete/:id', async (req, res, next) =>{
    try {
        await db.promise().query(`DELETE FROM events WHERE id='${req.params.id}'`);
    }
    catch(err) {
        console.log(err);
    }
})


module.exports = router;