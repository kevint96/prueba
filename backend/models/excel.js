const mongooseExcel = require('mongoose');
const { Schema } = mongooseExcel;

const excelSchema = new Schema({
    fx: [{type: String}],
    fy: [{type: String}],
    fz: [{type: String}],
    mx: [{type: String}],
    my: [{type: String}],
    mz: [{type: String}]
});

module.exports = mongooseExcel.model('excel', excelSchema);
