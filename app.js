const config = require('./config/config.json');
const express = require('express');

// express app
const app = express();
const PORT = process.env.PORT || 3000;

// API setup
const lib = require('lib')({token: config.apiToken});

// register view engine
app.set('view engine', 'ejs');

// middleware and static files
app.use(express.static('public'));

// routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/player', (req, res) => {
  const id = req.query.playerId;
  lib.halo.mcc['@0.0.11'].stats({
    gamertag: `${id}`,
  })
    .then((result) => {
      // console.log(result);
      // Trim last 20 game results to 8 games
      let form = result.last20.splice(0, 8);
      switch(result.gamesPlayed) {
        case 0 : 
          res.render('playerNotFound');
        default :
          res.render('player', { player: result, form });
      }
    })
    .catch((err) => {
      // console.log(err);
      res.redirect('playerNotFound');
    });
});

app.get('/playernotfound', (req, res) => {
  res.render('playerNotFound');
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => console.log(`App running on port ${PORT}`));