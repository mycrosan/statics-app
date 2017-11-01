
exports.up = function(knex, Promise) {
  var query = 'CREATE VIEW vw_tags AS ';
  query += ' SELECT';
  query += ' tag.nome                   AS nome';
  query += ' ,voa.dt_criacao              AS dt_criacao';
  query += ' ,voa.id                      AS item';
  query += ' ,oa.objetoAprendizagemTipoId AS objetoAprendizagemTipoId';
  query += ' FROM';
  query += ' (((pel_tag tag';
  query += ' JOIN pel_objeto_aprendizagem_tag atag';
  query += ' ON((atag.tagId = tag.id)))';
  query += ' JOIN vw_objeto_acesso_statics voa';
  query += ' ON(((atag.objetoAprendizagemId = voa.objeto)';
  query += ' AND (voa.usuarioId NOT IN (2,3,4,5,6,7,8,9,10)))))';
  query += ' JOIN pel_objeto_aprendizagem oa';
  query += ' ON((voa.objeto = oa.id)));';

  return knex.raw(query).then(function(err1, result1) {
    console.log(result1);
  });
};

exports.down = function(knex, Promise) {
  var queryViewOne = 'DROP VIEW vw_tags;';
  return knex.raw(queryViewOne).then(function(err1, result1) {
    console.log(result1)
  });
};
