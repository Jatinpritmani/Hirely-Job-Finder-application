require('./config/env_config')
const express = require("express");
const app = express();
const routes = require('./config/routes.js')
const figlet = require('figlet');
const {dbConnect} =require('./utilities/services/db.js')
app.use(express.json({ limit: '300mb' }));

app.use(express.urlencoded({ extended: true, limit: '150mb' }));

dbConnect()
app.use('/hjfa', routes);

let server = app.listen(process.env.PORT, () => {

  figlet.text(`Hirely Job Finder application`, { horizontalLayout: 'default', verticalLayout: 'default', width: 120, whitespaceBreak: true }, function (err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(data);

    console.log(`Server is running on http://${process.env.HOST}:${process.env.PORT}.`);
    console.log(`-----------------------------------------------------------------------------------`);
    console.log(`Start Time  : ` + (new Date()).toUTCString());
    console.log(`Environment : ${process.env.NODE_ENV}`);
    console.log(`SERVER_PORT : ${process.env.PORT}`);
    console.log(`-----------------------------------------------------------------------------------`);
  });
});

module.exports = { app, server }
