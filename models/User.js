const {Schema, model, Types} = require('mongoose');
const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    links: [{type: Types.ObjectId, ref: 'Link'}]      // это ссылка на модель Link в этой же папке

})
module.exports = model('User', schema)