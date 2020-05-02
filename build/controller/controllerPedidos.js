"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globales_1 = __importDefault(require("./../utils/globales"));
const seguridad_1 = require("./../utils/seguridad");
/**
 * @const {Pedidos}
 * @desc Import del modelo pedidos de la base de datos.
 */
const pedidos = require('./../../models').Pedidos;
/**
 * @const {Compras}
 * @desc Import del modelo compras de la base de datos.
 */
const compras = require('./../../models').compras;
/**
 * @classdesc Clase controladora de pedidos.
 * @desc FechaCreacion: 01/04/2020
 * @class
 * @public
 * @version 1.0.0
 * @returns {pedidosController} pedidosController
 * @author Danny Rios <dprios@espol.edu.ec>
 */
class pedidosController {
    /**
     * @async
     * @method
     * @public
     * @version 1.0.0
     * @author Danny Rios <dprios@espol.edu.ec>
     * @returns {JSON} JSON con los datos obtenidos de la consulta.
     * @desc Este método se encarga de buscar los pedidos <br> FechaCreacion: 01/04/2020
     * @param {Request} req Objeto Request
     * @param {Response} res Objeto response
     * @type {Promise<void>} Promesa de tipo void.
     */
    getData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = true;
            if (!token) {
                res.status(401).json({ log: "Token invalido." });
                return;
            }
            pedidos.findAll({
                attributes: ['idpedido', 'idcompra', 'idproducto', 'cantidad', 'subtotal', 'cubiertos'],
                include: [
                    {
                        model: compras,
                        required: true,
                        attributes: ['idcompra', 'fechacompra', 'entregaDomocilio', 'horaEntrega']
                    }
                ]
            }).then((data) => {
                res.status(200).json(data);
                return;
            }, (err) => {
                res.status(500).json({ log: "Error!! No hay datos en la base" });
                console.log(err);
                return;
            });
        });
    }
    /**
   * @async
   * @method
   * @public
   * @version 1.0.0
   * @author Danny Rios <dprios@espol.edu.ec>
   * @returns {JSON} JSON con la respuesta de la transacción.
   * @desc  Este método se encarga de agregar un nuevo pedido <br> FechaCreacion: 01/04/2020
   * @param {Request} req Objeto Request
   * @param {Response} res Objeto response
   * @type {Promise<void>} Promesa de tipo void.
   */
    postData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = true;
            if (!token) {
                res.status(401).json({ log: "Token invalido." });
                return;
            }
            let JsonValido = true;
            if (!JsonValido) {
                res.status(401).json({ log: "Violación de integridad de datos." });
                return;
            }
            let { hash } = req.body;
            let pedido = {
                idpedido: req.body.idpedido,
                idcompra: req.body.idcompra,
                idproducto: req.body.idproducto,
                cantidad: req.body.cantidad,
                subtotal: req.body.subtotal,
                cubiertos: req.body.cubiertos
            };
            let hashInterno = seguridad_1.Seguridad.hashJSON(pedido);
            //let hashDesencriptado = Seguridad.desencriptar(hashInterno);
            pedido.createdAt = new Date();
            if (hashInterno != hash) {
                res.status(401).json({ log: "Violación de integridad de datos, hash invalido.", hash, hashInterno });
                return;
            }
            pedido.createdAt = new Date();
            pedidos.create(pedido).then((resp) => {
                if (resp._options.isNewRecord) {
                    res.status(202).json({
                        log: "Pedido ingresado con éxito",
                        uri: globales_1.default.globales.urlBasePedidos + resp.dataValues.idpedido
                    });
                    return;
                }
                res.status(200).json({ log: "No se ingresaron los datos." });
                return;
            }, (err) => {
                res.status(500).json({ log: "Error" });
                console.log(err);
                return;
            });
        });
    }
    /**
    * @async
    * @method
    * @public
    * @version 1.0.0
    * @author Danny Rios <dprios@espol.edu.ec>
    * @returns {JSON} JSON con la respuesta de la transacción.
    * @desc  Este método se encarga de eliminar un pedido buscandolo en base al id proporcionado
     por la url. <br> FechaCreacion: 01/04/2020
    * @param {Request} req Objeto Request
    * @param {Response} res Objeto response
    * @type {Promise<void>} Promesa de tipo void.
    */
    deleteData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            if (isNaN(id)) {
                res.status(500).json({ log: "El ID introducido no es valido." });
                return;
            }
            id = Number(id);
            if (Number.isInteger(id) == false) {
                res.status(500).json({ log: "El ID introducido no es valido, debe ser un entero." });
                return;
            }
            let token = true;
            if (!token) {
                res.status(401).json({ log: "Token invalido." });
                return;
            }
            pedidos.destroy({ where: { idpedido: id } }).then((data) => {
                if (data == 1) {
                    res.status(200).json({ log: "Pedido eliminado correctamente" });
                    return;
                }
                else {
                    res.status(200).json({ log: "No existe el pedido que desea eliminar." });
                    return;
                }
            }, (err) => {
                res.status(500).json({ log: "Error!!" });
                console.log(err);
                return;
            });
        });
    }
    /**
   * @async
   * @method
   * @public
   * @version 1.0.0
   * @author Danny Rios <dprios@espol.edu.ec>
   * @returns {JSON} JSON con la respuesta de la transacción.
   * @desc  Este método se encarga de buscar el pago en base al ID proporcionaro en la url
   * . <br> FechaCreacion: 01/04/2020
   * @param {Request} req Objeto Request
   * @param {Response} res Objeto response
   * @type {Promise<void>} Promesa de tipo void.
   */
    findByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            if (isNaN(id)) {
                res.status(500).json({ log: "El ID introducido no es valido." });
                return;
            }
            id = Number(id);
            if (Number.isInteger(id) == false) {
                res.status(500).json({ log: "El ID introducido no es valido, debe ser un entero." });
                return;
            }
            pedidos.findOne({
                where: {
                    idpedido: id
                },
                attributes: ['idpedido', 'idcompra', 'idproducto', 'cantidad', 'subtotal', 'cubiertos'],
                include: [
                    {
                        model: compras,
                        required: true,
                        attributes: ['idcompra', 'fechacompra', 'entregaDomocilio', 'horaEntrega']
                    }
                ]
            }).then((data) => {
                if (data == null) {
                    res.status(404).json({ log: "No Existen datos a mostrar para el ID." });
                    return;
                }
                res.status(200).json(data);
                return;
            }, (err) => {
                res.status(500).json(err);
                return;
            });
        });
    }
}
exports.default = new pedidosController();
