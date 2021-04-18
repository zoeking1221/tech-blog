const path = require('path');
const express = require('express');
const routes = require('./controllers');
const app = express();
const sequelize = require('./config/connection');
const session = require('express-session');
const helpers = require('./utils/helpers');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
  };
  
  app.use(session(sess));

// handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });



const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});

  // if it were set to true, it would drop and re-create all of the database tables on startup. 
// This is great for when we make changes to the Sequelize models
// as the database would need a way to understand that something has changed.
