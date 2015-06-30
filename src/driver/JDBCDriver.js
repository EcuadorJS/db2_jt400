import FileNotExistError from '../error/FileNotExistError';
import fs from 'fs';
import java from 'java';
import path from 'path';

let singleton = Symbol();
let singletonEnforcer = Symbol();

/**
* @class AS400JDBCDriver
*
*/
class JDBCDriver {

  constructor(enforcer) {
    if(enforcer !== singletonEnforcer){
      throw new CreateInstanceError('No se puede crear una instancia ya que es una clase Singleton');
    } else {
      this._className = "com.ibm.as400.access.AS400JDBCDriver";
      this._pathJar = path.join(__dirname, './jt400.jar');
      this._driverInstance = null;
      this._loadDriver();
    }
  }

  /**
  * Get instance of Driver
  * @return {AS400JDBCDriver}
  */
  static get instance() {
    if(!this[singleton]) {
      this[singleton] = new JDBCDriver(singletonEnforcer);
    }
    return this[singleton];
  }

  static get className() {
    return this[singleton]._className;
  }

  /**
  * Load driver jt400
  */
  _loadDriver() {
    let exist = fs.existsSync(this._pathJar);
    if(!exist) {
      reject(new FileNotExistError('El driver ${this._pathJar} no existe'));
    } else {
      try {
        java.classpath.push(this._pathJar);
        java.import(this._driverName);
        this._driverInstance = java.newInstanceSync(this._className);
        java.callStaticMethodSync('java.sql.DriverManager', 'registerDriver', this._driverInstance);
      } catch(ex) {
        console.log(ex);
      }
    }
  }
}

export default JDBCDriver;
