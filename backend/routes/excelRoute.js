const express = require('express');
const router = express.Router();

const excel = require('../controllers/excel.controller');


router.get('/', excel.getDatos);
router.post('/', excel.guardar);

module.exports = router;