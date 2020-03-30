'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pedidos = sequelize.define('Pedidos', {
    idpedido: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    idcompra: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    idproducto: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    cantidad: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    subtotal: {
      allowNull: false,
      type: Sequelize.FLOAT
    },
    cubiertos: {
      allowNull: false,
      type: Sequelize.BOOLEAN
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {});

  /*
  Fcreación: 30/03/2020
  Fmodificación: 30/03/2020
  Ucreación: Danny
  Umodificación: Danny
  Comentarios: se asocia el idcompra de la tabla compra porque es foreignkey
  Parametros de entrada: modelo Compras, el campo idcompra y como se mostrará
  */
  Pedidos.associate = function(models) {
    // associations can be defined here
    Pedidos.belongsTo(models.compras,{
      foreignKey: 'idcompra',
      as: 'Codigo_Compra'
    });

  };
  return Pedidos;
};