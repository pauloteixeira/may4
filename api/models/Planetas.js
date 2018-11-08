/**
 * Planets.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    num: { 
      type: 'number'
    },
    nome: {
      type: 'string',
      required: true,
      unique: true
    },
    clima: {
      type: 'string',
      required: true,
      unique: false
    },
    terreno: {
      type: 'string',
      required: true,
      unique: false
    }
  },
  
  beforeCreate: function(obj, next){
    Planetas.count().exec(function(err, cnt){
        if(err) next(err);
        else{
            obj['num'] = cnt + 1;
            next(null);
        }
    })
}

};

