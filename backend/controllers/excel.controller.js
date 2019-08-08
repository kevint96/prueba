const Excel = require('../models/excel');

const excelCtrl = {};

var listaCargas=[];

excelCtrl.getDatos= async (req, res, next) => {
    const excel = await Excel.find();
    listaCargas = excel;
    res.json(listaCargas[listaCargas.length - 1]);    
};

excelCtrl.guardar = async (req, res, next) => {
    const excel = new Excel({
        fx: req.body.fx,
        fy: req.body.fy,
        fz: req.body.fz,
        mx: req.body.mx,
        my: req.body.my,
        mz: req.body.mz
    });

    var tamaño = req.body.fx.length;

    console.log("Fx es: " , req.body.fx);

    listaCargas.push(excel);
    
    // console.log(req.body)
    await excel.save();
    console.log("El tamaño es:", tamaño);
    res.json({ status: 'excel created',
                tamaño: tamaño});
};

module.exports = excelCtrl;