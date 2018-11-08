/**
 * PlanetsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
"use strict";
module.exports = {
  'detail': function( req, res ) {
      const swapi = require('swapi-node');
      let id = req.param('id');
      let planets;
      let baseUrl = "http://swapi.co/api/";
      const pattern = /\d+/g;
      let planetas;

      // get planet from base
      Planetas.findOne({num:  id}).exec( function( err, planeta ) {
          if( err ) {
              return res.serverError( err );
          }

          if( !planeta ) {
              return res.notFound();
          }

          // search a film list from planet
          swapi.get(baseUrl + 'planets/?search=' + planeta.nome).then(( filme ) => {
            var arrayFilmes = [];
    
            if( filme ) {
              let filmes = filme.results[0].films;
              for( let i = 0; i < filmes.length; i++ ) {
                let filmURL = baseUrl + 'films/' + filmes[i].match( pattern );

                // get informations from films
                swapi.get(filmURL).then(( detalhe ) => {
                  arrayFilmes.push(detalhe);

                  // populate object with film list
                  if( i+1 == filmes.length ) {
                    planetas = {
                      nome: planeta.nome,
                      clima: planeta.clima,
                      terreno: planeta.terreno,
                      filmes: [
                        arrayFilmes   
                      ]
                    }
          
                    return res.status(200).json(planetas);
                  }
                });
              }
            }
            
          });
      });

      return;
  },

  'update': function( req, res ) {
    let id = req.param('id');
    let planet = {
      nome: req.param("nome"),
      clima:  req.param("clima"),
      terreno: req.param("terreno")
    };

    Planetas.update( {num: id}, { nome: planet.nome, clima: planet.clima, terreno: planet.terreno } ).exec( ( err ) => {
        if( err ) {
          return res.status(500).json({ error: err });
        }

        return res.ok();
    } );

    return;
  },

  'delete': function( req, res ) {
    let id = req.param('id');

    Planetas.destroy({ num: id }).exec( ( err ) => {
        if( err ) {
          return res.status(500).json({ error: err });
        }

        return res.ok();
    } );

    return;
  },

  'search': function( req, res ) {
    let nome = req.param('term');

    Planetas.find({ nome: { 'contains' : nome }}).exec( ( err, planetas ) => {
      if( err ) {
          return res.serverError( err );
      }

      if( !planetas ) {
          return res.notFound();
      }

      return res.status(200).json(planetas);
    })
  }
};

