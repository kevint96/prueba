const express = require('express');
const router = express.Router();

const zapatas = require('../controllers/zapatas.controller');
const excel = require('../controllers/excel.controller');


router.get('/', zapatas.getZapatas);
router.get('/darZapata', zapatas.darZapata);
router.get('/darBases', zapatas.darBases);
router.post('/', zapatas.sumar);
router.post('/', excel.guardar);
router.post('/bases', zapatas.bases);


module.exports = router;


