'use strict';
var url = require('url');
var express = require('express');
var _defaults = require('lodash');
var path = require('path');
var jsonata = require("jsonata");

module.exports = function () {
  return {
    migration: function(connection) {
      if (!connection) {
        connection = {
          connector: 'mysql',
          host : 'localhost',
          user : 'root',
          password : 'root',
          database : 'production_api'
        }
      }
      var knex = require('knex')({
        client: connection.connector,
        connection: {
          host : connection.host,
          user : connection.user,
          password : connection.password,
          database : connection.database
        },
        migrations: {
          tableName: 'knex_migrations'
        }
      });
      knex.migrate.latest({directory: __dirname +'/../migrations'})
        .then(function(result) {
          console.log(result);
        })
        .catch(function(erro) {
          console.log('bbbbbbbbbb'+JSON.stringify(erro))
          // migrations are finished
        });
    },
    query: function(req, res, connection) {
      if (!connection) {
        connection = {
          connector: 'mysql',
          host : 'localhost',
          user : 'root',
          password : 'root',
          database : 'production_api'
        }
      }
      var knex = require('knex')({
        client: connection.connector,
        connection: {
          host : connection.host,
          user : connection.user,
          password : connection.password,
          database : connection.database
        },
        pool: { min: 0, max: 10 }
      });
      var indexCol = 0;
      if(req.query.filter){
        req.query.filter =  JSON.parse(req.query.filter);
      }
      var queryAvg = knex(req.query.filter.include[0].model);
      var query = knex(req.query.filter.include[0].model);
      var queryCol = knex(req.query.filter.include[0].model);
      req.query.filter.include.forEach(function(model,index){
        if(index == 0) {

        } else {
          query.from(model.model);
          queryAvg.from(model.model);
          //query.from(model.model);
        }
      });
      var header = {
        row: [],
        col: [],
        expr: []
      }
      var orderBy = [];
      var rows = [];
      var rowsPlain = [];
      var avgItem = [];
      if(req.query.filter.rows){
        req.query.filter.rows.forEach(function(row,index){
          if(row.distinct){
            rows.push('DISTINCT('+ row.model+'.'+row.field+') as _'+indexCol);
          }else{
            rows.push(row.model+'.'+row.field+' as _'+indexCol);
          }
          rowsPlain.push(row.model+'.'+row.field);
          if(row.order){
            orderBy.push('_'+indexCol+' '+row.order);
          }
          avgItem.push(row.model+'.'+row.field);
          header.row.push({id:'_'+indexCol, name: row.model+'.'+row.field});
          indexCol++
        });
        query.column(knex.raw(rows));
      }
      var expr = {};
      if(req.query.filter.expr){
        req.query.filter.expr.forEach(function(row,index){
          var func = row.func;
          if(!expr[func]){
            expr[func] = [];
          }
          expr[func].push(row.model+'.'+row.field+' as _'+indexCol)
          if(row.order){
            orderBy.push('_'+indexCol+' '+row.order);
          }
          header.expr.push({id:'_'+indexCol, name: row.model+'.'+row.field});
          indexCol++;
        });
        for (var key in expr) {
          query[key](expr[key][0]);
          queryAvg[key](expr[key][0]);
        }
        if(header.row.length!=0){
          query.groupBy(rowsPlain)
        }
      }
      if(req.query.filter.where){
        req.query.filter.where.forEach(function(row,index){
          query.whereRaw(row.model+'.'+row.field+' '+row.op+' ?', row.value);
          queryAvg.whereRaw(row.model+'.'+row.field+' '+row.op+' ?', row.value);
        });
      }
      var col=[];
      if(req.query.filter.cols){
        var colName = req.query.filter.cols[0].model+'.'+req.query.filter.cols[0].field;
        var orgColName = colName;
        if(req.query.filter.cols[0].format){
          var arrayDate=[];
          var splitDate = req.query.filter.cols[0].format.split('/');
          if(_defaults.indexOf(splitDate,'yyyy') !== -1){
            arrayDate.push('%Y');
          }
          if(_defaults.indexOf(splitDate,'mm') !== -1){
            arrayDate.push('%m');
          }
          if(_defaults.indexOf(splitDate,'dd') !== -1){
            arrayDate.push('%d');
          }
          var strDate = "'"+arrayDate.join('-')+"'"
          colName =  'DATE_FORMAT('+colName+','+strDate+')';
        }
        queryCol.column(knex.raw(colName+' as date'));
        queryCol.distinct(knex.raw(colName))
        if(req.query.filter.where){
          req.query.filter.where.forEach(function(row,index){
            queryCol.whereRaw(row.model+'.'+row.field+' '+row.op+' ?', row.value);
          });
        }
        console.log(queryCol.select().toSQL())
        queryCol.orderByRaw('date ASC')
        queryCol.select()
          .then(function(rows) {
            if(req.query.filter.cols[0].limit){
              var quarterNumber = Math.ceil(rows.length / req.query.filter.cols[0].limit)
              var chuckArray = _defaults.chunk(rows, quarterNumber);
              var newArrayDate = [];
              chuckArray.forEach(function(itemChuck){
                newArrayDate.push({date:[itemChuck[0].date, itemChuck[(itemChuck.length - 1)].date]});
              });
              rows = newArrayDate;
            }
            for (var key in expr) {
              var valueCol = 'null';
              var fieldCol = colName;
              rows.forEach(function(row, indexcol){
                var clause =''
                if(Array.isArray(row.date)){
                  clause = ' BETWEEN \''+row.date[0]+'\' AND \''+row.date[1]+'\'';
                  row.date = row.date.join(' - ');
                }else{
                  clause = ' = \''+row.date+'\'';
                }
                var colWhere = 'COUNT(case when '+colName+' '+clause+' then '+fieldCol+' else '+valueCol+' end) as _'+indexCol+'';
                header.col.push({id:'_'+indexCol, name: req.query.filter.cols[0].model+'.'+req.query.filter.cols[0].field, value: row.date});
                query.column(knex.raw(colWhere));
                queryAvg.column(knex.raw('COUNT(case when '+colName+' '+clause+' then '+fieldCol+' else '+valueCol+' end)/COUNT( DISTINCT '+avgItem.join(",")+') as _'+indexCol+''))
                indexCol++
              });
            }
            if(orderBy.length){
              query.orderByRaw(orderBy.join(', '));
            }
            console.log(query.select().toSQL());
            query.select().then(function(projectNames) {
              var result = {};
              result.header = header;
              result.data = projectNames;
              return result;
            }).then(function(result) {
              queryAvg.select().then(function(projectNamesAvg){
                result.avg = projectNamesAvg;
                res.send(result);
              }).catch(function(error) {
                console.error(error);
              });
            });
          });
      }else{
        if(orderBy.length){
          query.orderByRaw(orderBy.join(', '));
        }
        query.select().then(function(projectNames){
          var result = {};
          result.header = header;
          result.data = projectNames;
          res.send(result);
        }).catch(function(error) {
          console.error(error);
        });
      }
    }
  }
};
