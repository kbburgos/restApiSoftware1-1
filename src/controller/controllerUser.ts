import { Request, Response } from "express";
import global from "../utils/global";
import { userinterface } from "../interfaces/userInterface";
const rols = require("./../../models").rols;
import { Security } from "../utils/security";

/**
 * @const User
 * @desc Import User model from data base.
 */

const user = require("./../../models").Usuarios;

/**
 * @classdesc User controller class.
 * @desc Creation Date: 12/04/2020
 * @class
 * @public
 * @version 1.0.0
 * @returns {userController} userController
 * @author Karla Burgos <kbburgos@espol.edu.ec>
 */

class userController {
  /**
   * @async
   * @method
   * @public
   * @version 1.0.0
   * @author Karla Burgos <kbburgos@espol.edu.ec>
   * @returns {JSON} JSON with the transaction response.
   * @desc  This method add a user to the system. <br> Creation Date: 19/04/2020
   * @param {Request} req Objeto Request
   * @param {Response} res Objeto response
   * @type {Promise<void>} Void Promise.
   */

  public async addUser(req: Request, res: Response): Promise<void> {
    let {hash}  =  req.body;
    
    //data description here
    let data: userinterface = {
      cedula: req.body.cedula,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      telefono: req.body.telefono,
      email: req.body.email,
      contrasenia: req.body.contrasenia,
      rol: req.body.rol,
      direccion: req.body.direccion
    };
    let hashInterno = Security.hashJSON(data);
    //here the hash must be decrypted
    data.createdAt = new Date();
    if (hashInterno != hash) {
      res
        .status(401)
        .json({log: "Violación de integridad de datos, hash invalido."});
      return;
    }

    user.create(data).then(
      (resp: any) => {
        if (resp._options.isNewRecord) {
          res.status(202).json({
            log: "Ingresado",
            uri: global.globals.urlUserBase + resp.dataValues.cedula,
          });
          return;
        }
        res.status(200).json({ log: "No se ingresaron los datos." });
        return;
      },
      (err: any) => {
        res.status(500).json({ log: "Error", error: err.original.code });
        console.log(err);
        return;
      }
    );
  }

  /**
   * @async
   * @method
   * @public
   * @version 1.0.0
   * @author Karla Burgos <kbburgos@espol.edu.ec>
   * @returns {JSON} JSON with the consult data.
   * @desc This method is responsible for searching the user based on the ID provided in the url. <br> Creation Date: 12/04/2020
   * @param {Request} req Objeto Request
   * @param {Response} res Objeto response
   * @type {Promise<void>} Void Ptromise.
   */

  public async findByID(req: Request, res: Response): Promise<void> {
    let id: any = req.params.id;
   
    if (isNaN(id)) {
      
      res.status(500).json({ log: "La cédula introducida no es valido." });
      return;
    }
    id = Number(id);
    if (Number.isInteger(id) == false) {
      res
        .status(500)
        .json({ log: "El ID introducido no es valido, debe ser un entero." });
      return;
    }
    user
      .findOne({
        where: {
          cedula: id,
        },
        attributes: ["cedula", "nombre", "apellido", "direccion", "rol"],
      })
      .then(
        (data: any) => {
          if (data == null) {
            res
              .status(404)
              .json({ log: "No Existen datos a mostrar para el ID." });
            return;
          }
          res.status(200).json(data);
          return;
        },
        (err: any) => {
          res.status(500).json(err);
          return;
        }
      );
  }

  /**
   * @async
   * @method
   * @public
   * @version 1.0.0
   * @author Karla Burgos <kbburgos@espol.edu.ec>
   * @returns {JSON} JSON with the transaction response.
   * @desc  This method removes the user from the base to the ID which is provided by the url. <br> Creation Date: 12/04/2020
   * @param {Request} req Objeto Request
   * @param {Response} res Objeto response
   * @type {Promise<void>} Void Promise.
   */

  public async deleteUser(req: Request, res: Response): Promise<void> {
    let id: any = req.params.id;
    if (isNaN(id)) {
      res.status(500).json({ log: "El ID introducido no es valido." });
      return;
    }
    id = Number(id);
    if (Number.isInteger(id) == false) {
      res
        .status(500)
        .json({ log: "El ID introducido no es valido, debe ser un entero." });
      return;
    }
    user.destroy({ where: { cedula: id } }).then(
      (data: any) => {
        if (data == 1) {
          res.status(200).json({ log: "Eliminado" });
          return;
        } else {
          res.status(200).json({ log: "Sin datos a eliminar." });
          return;
        }
      },
      (err: any) => {
        res.status(500).json({ log: "Error" });
        console.log(err);
        return;
      }
    );
  }


  /**
   * @async
   * @method
   * @public
   * @version 1.0.0
   * @author Karla Burgos <kbburgos@espol.edu.ec>
   * @returns {JSON} JSON with the transaction response.
   * @desc  This method modifies the user's information in the database, all the data is updated. <br> Creation Date: 19/04/2020
   * @param {Request} req Objeto Request
   * @param {Response} res Objeto response
   * @type {Promise<void>} Void Promise.
   */

  public async updateUsuario(req: Request, res: Response): Promise<void> {
    let id: any = req.params.id;
    if (isNaN(id)) {
      res.status(500).json({ log: "La cédula ingresada no es valida." });
      return;
    }
    id = String(id);
    let { hash } = req.body;
    //aqui desencriptar los datos
    let data: userinterface = {
      cedula: req.body.cedula,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      telefono: req.body.telefono,
      email: req.body.email,
      direccion: req.body.direccion,
      contrasenia: req.body.contrasenia,
      rol: req.body.rol,
      updatedAt: new Date(),
    };
    let hashInterno = Security.hashJSON(data);
    //aqui se debe desencriptar el hash
    //data.createdAt = new Date();
    if (hashInterno != hash) {
      res
        .status(401)
        .json({ log: "Violación de integridad de datos, hash invalido." });
      return;
    }

    user
      .update(data, {
        where: {
          cedula: id,
        },
      })
      .then(
        (resp: any) => {
          if (resp[0] == 1) {
            res.status(200).json({ log: "Usuario actualizado." });
            return;
          }
          res.status(202).json({ log: "No se pudo actualizar." });
          return;
        },
        (err: any) => {
          res.status(500).json({ log: "Error" });
          console.log(err);
          return;
        }
      );
  }
}
export default new userController();
