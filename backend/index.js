const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const index = require('./routes/index');
const excel = require('./routes/excelRoute');

//Se debe inicializar en una consola aparte el comando sudo mongod para que corra en el servidor!
const { mongoose } = require('./database/database');
const { mongooseExcel } = require('./database/exceldb');

//Settings
app.set('port', process.env.PORT || 3000)
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'ejs');



//middlewares
app.use(cors({origin: 'http://localhost:4200'}));
app.use(express.json());

//Rutas
app.use('/api/zapatas', index);
app.use('/api/excel', excel);


//Static files


//Static server
app.listen(app.get('port'),() =>{
    console.log("Servidor escuchando en el puerto", app.get('port'));
});

