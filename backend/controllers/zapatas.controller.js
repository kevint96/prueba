const Zapatas = require('../models/zapatas');
const Excel = require('../models/excel');
const Bases = require('../models/bases');
const Funciones = require('../funciones/funciones')

const zapatasCtrl = {};

var listazapatas = [];
var listaCargas = [];
var listaBases = [];
var listaBaseBx = [];
var listaBaseBy = [];
var listaBaseE = [];
var listaBaseCx = [];
var listaBaseCy = [];
var listaBaseH = [];

//Datos internos
var listaPesoZapata, listaPesoPedestal, listaPesoSuelo, listaCargaVertical, listaMomentoActuanteMX, listaMomentoActuanteMY = [];
var A = [];
var Ly = [];
var QMax = [];
var QMin = [];
var Mdx = [];
var Mdy = [];
var Ax = [];
var Ay = [];
var Asx = [];
var Asy = [];
var Vx = [];
var Vy = [];
var Vc = [];
var Vpuz = [];
var Vcon = [];

//Se devuelve la zapata actual, la ultima
zapatasCtrl.darZapata = async (req, res, next) => {
    const zapatas = await Zapatas.find();
    listazapatas = zapatas;
    res.json(listazapatas[listazapatas.length - 1]);
    // darListaZapata();
    console.log("Lista de zapatas:",listazapatas[listazapatas.length - 1]);
};

zapatasCtrl.darBases = async (req, res, next) => {
    const bases = await Bases.find();
    listaBases = bases;
    res.json(listaBases[listaBases.length - 1]);
};

darListaZapata = async (req, res, next) => {
    const zapatas = await Zapatas.find();
    listazapatas = zapatas;
    console.log("Zapatas", zapatas);
    console.log("Lista de zapatas:", listazapatas);
}


//Se devuelven todas las zapatas, y se iguala la lista Array
zapatasCtrl.getZapatas = async (req, res, next) => {
    const zapatas = await Zapatas.find();
    res.json(zapatas);
    // console.log("Lista de zapatas");
    listazapatas = zapatas;
    // console.log(listazapatas[0].cargaMuerta);
    // var suma =Funciones.calcularSuma();
    // console.log("La suma essss: ",suma);
    // prueba();
    // darUltimaZapata();
};

zapatasCtrl.bases = async (req, res, next) => {
    //Datos que se traen de las zapatas
    const zapatas = await Zapatas.find();
    listazapatas = zapatas;
    //Lista de ultima zapata almacenada
    var lista = listazapatas[listazapatas.length - 1]

    //Datos que se traen de las cargas de etabs excel
    const excel = await Excel.find();
    listaCargas = excel;
    var listaEtabs = listaCargas[listaCargas.length - 1]

    const bases = new Bases({
        bx: req.body.bx,
        by: req.body.by,
        e: req.body.e,
        cx: req.body.cx,
        cy: req.body.cy,
        h: req.body.h
    })
    // var tamaño = req.body.bx.length;
    await bases.save();
    listaBaseBx = [];
    listaBaseBy = [];
    listaBaseE = [];
    listaBaseCx = [];
    listaBaseCy = [];
    listaBaseH = [];
    for (let i = 0; i < req.body.bx.length; i++) {
        listaBaseBx.push(req.body.bx[i]);
        listaBaseBy.push(req.body.by[i]);
        listaBaseE.push(req.body.e[i]);
        listaBaseCx.push(req.body.cx[i]);
        listaBaseCy.push(req.body.cy[i]);
        listaBaseH.push(req.body.h[i]);
    }

    listaBases.push(bases);

    //Se limpian los Arrays
    listaPesoZapata, listaPesoPedestal, listaPesoSuelo, listaCargaVertical, listaMomentoActuanteMX, listaMomentoActuanteMY = [];
    A = [];
    Ly = [];
    QMax = [];
    QMin = [];
    Mdx = [];
    Mdy = [];
    Ax = [];
    Ay = [];
    Asx = [];
    Asy = [];
    Vx = [];
    Vy = [];
    Vc = [];
    Vpuz = [];
    Vcon = [];

    //Llamada a metodos de Funciones
    listaPesoZapata = Funciones.darPesoZapata(listaBaseBx, listaBaseBy, listaBaseE, lista.pesoZapata);
    listaPesoPedestal = Funciones.darPesoPedestal(listaBaseCx, listaBaseCy, listaBaseH, listaBaseE, lista.pesoZapata);
    listaPesoSuelo = Funciones.darPesoSuelo(listaBaseBx, listaBaseBy, listaBaseCx, listaBaseCy, listaBaseH, listaBaseE, lista.pesoSuelo);
    listaCargaVertical = Funciones.darCargaVertical(listaPesoZapata, listaPesoPedestal, listaPesoSuelo, listaEtabs.fz);
    listaMomentoActuanteMX = Funciones.darMomentosActuantesMx(listaEtabs.mx, listaEtabs.fy, listaBaseH, listaBaseE);
    listaMomentoActuanteMY = Funciones.darMomentosActuantesMy(listaEtabs.my, listaEtabs.fx, listaBaseH, listaBaseE);
    A = Funciones.darPropiedadGeometricaA(listaBaseBx, listaBaseBy);
    Lx = Funciones.darPropiedadGeometricaLx(listaBaseBx, listaBaseBy);
    Ly = Funciones.darPropiedadGeometricaLy(listaBaseBy, listaBaseBx);
    QMax = Funciones.darEsfuerzosActuantesQMax(listaCargaVertical, A, listaMomentoActuanteMX, listaBaseBy, Lx, listaMomentoActuanteMY, listaBaseBx, Ly);
    QMin = Funciones.darEsfuerzosActuantesQMin(listaCargaVertical, A, listaMomentoActuanteMX, listaBaseBy, Lx, listaMomentoActuanteMY, listaBaseBx, Ly);
    Mdx = Funciones.darDiseñoFlexionMdx(QMax, listaBaseBy, listaBaseCy, lista.factorMayoracionUsuario);
    Mdy = Funciones.darDiseñoFlexionMdx(QMax, listaBaseBx, listaBaseCx, lista.factorMayoracionUsuario);
    Ax = Funciones.darAreaAceroAx(Mdy, listaBaseE, listaBaseBy);
    Ay = Funciones.darAreaAceroAy(Mdx, listaBaseE, listaBaseBy);
    Asx = Funciones.darSepCabillasAsx(lista.diametroAcero, listaBaseBy, Ax);
    Asy = Funciones.darSepCabillasAsy(lista.diametroAcero, listaBaseBx, Ay);
    Vx = Funciones.darDiseñoPorCorteVx(QMax, QMin, listaBaseBy, listaBaseBx, listaBaseCx, listaBaseE);
    Vy = Funciones.darDiseñoPorCorteVy(QMax, QMin, listaBaseBy, listaBaseBx, listaBaseCy, listaBaseE);
    Vc = Funciones.darDiseñoPorCorteVc(listaBaseBx, lista.pesoConcreto);
    Vpuz = Funciones.darPunzonadoVpuz(QMax, QMin, listaBaseBx, listaBaseBy, listaBaseCx, listaBaseE, listaBaseCy);
    Vcon = Funciones.darPunzonadoVcon(QMax, lista.pesoConcreto);
    // console.log("listapesoZapata :", listaPesoZapata);
    // console.log("listapesoPedestal :", listaPesoPedestal);
    // console.log("listapesoSuelo :", listaPesoSuelo);
    // console.log("listaEtabs :", listaEtabs);
    // console.log("listaCargaVertical :", listaCargaVertical);
    // console.log("listaMomentoActuanteMX :", listaMomentoActuanteMX);
    // console.log("listaMomentoActuanteMY:", listaMomentoActuanteMY);
    // console.log("A :", A);
    // console.log("Lx :", Lx);
    // console.log("Ly :", Ly);
    // console.log("Qmax :", QMax);
    // console.log("Qmin :", QMin);
    // console.log("Mdx :", Mdx);
    // console.log("Mdy :", Mdy);
    // console.log("Ax :", Ax);
    // console.log("Ay :", Ay);
    // console.log("Asx :", Asx);
    // console.log("Asy :", Asy);
    // console.log("Vx :", Vx);
    // console.log("Vy :", Vy);
    // console.log("Vc :", Vc);
    // console.log("Vpuz :", Vpuz);
    // console.log("Vcon :", Vcon);

    res.json({
        listaPesoZapata: listaPesoZapata,
        listaPesoPedestal: listaPesoPedestal,
        listaPesoSuelo: listaPesoSuelo,
        listaCargaVertical: listaCargaVertical,
        listaMomentoActuanteMX: listaMomentoActuanteMX,
        listaMomentoActuanteMY: listaMomentoActuanteMY,
        A: A,
        Lx: Lx,
        Ly: Ly,
        QMax: QMax,
        QMin: QMin,
        Mdx: Mdx,
        Mdy: Mdy,
        Ax: Ax,
        Ay: Ay,
        Asx: Asx,
        Asy: Asy,
        Vx: Vx,
        Vy: Vy,
        Vc: Vc,
        Vpuz: Vpuz,
        Vcon: Vcon
    });

    // console.log("La lista de basebx esssssssssssssssssss: ", listaBaseBx);

    Funciones.advertenciaCargaAdmisible(QMax,lista.cargaAdmisibleSuelo);
    Funciones.advertenciaDiseñoCorte(Vx,Vc);
    Funciones.advertenciaPunzonado(Vpuz,Vcon);

}

zapatasCtrl.sumar = async (req, res, next) => {
    const zapatas = new Zapatas({
        pesoSuelo: req.body.pesoSuelo,
        pesoConcreto: req.body.pesoConcreto,
        diametroAcero: req.body.diametroAcero,
        pesoZapata: req.body.pesoZapata,
        cargaViva: req.body.cargaViva,
        cargaMuerta: req.body.cargaMuerta,
        cargaAdmisibleSuelo: req.body.cargaAdmisibleSuelo,
        factorMayoracion: req.body.factorMayoracion,
        factorMayoracionUsuario: req.body.factorMayoracionUsuario
    });
    console.log("antes",listazapatas[listazapatas.length - 1]);
    listazapatas.push(zapatas);
    console.log("El tamaño de la lista es:", listazapatas.length);
    // var pesoSuelo = req.body.pesoSuelo;
    // var pesoConcreto = req.body.pesoConcreto;
    // var total = 0;
    // var cargaViva = (parseInt(req.body.cargaViva));
    // var cargaMuerta = (parseInt(req.body.cargaMuerta));
    // total = (parseInt(pesoSuelo) + parseInt(pesoConcreto));
    // console.log("El total es :" + total);
    // var m = Funciones.darMayoracion(cargaViva, cargaMuerta);
    // console.log("metodo: ", m);
    await zapatas.save();
    // console.log("Zapatas: ", zapatas);
    res.json({
        status: 'Se agregaron los datos!'
    });

    console.log("despues",listazapatas[listazapatas.length - 1]);   
};

module.exports = zapatasCtrl, listazapatas;
exports.listazapatas = listazapatas;