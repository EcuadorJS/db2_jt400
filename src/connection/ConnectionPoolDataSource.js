import java from 'java';
import ConnectionPool from './ConnectionPool';
import JDBCDriver from '../driver/JDBCDriver';

class ConnectionPoolDataSource {

  constructor(config) {
    this._className = "com.ibm.as400.access.AS400JDBCConnectionPoolDataSource";
    this._config = config || {};
    this._connectionPoolDataSourse;
    this._connectionPool;
    this._initialize();
  }

  _isInitialized() {
    return (this._config && this._connectionPoolDataSourse && this._connectionPool);
  }

  _initialize() {
        if(this._isInitialized()) {
            throw 'Error';
        }

        try {
            this._instanceDriver = JDBCDriver.instance;
            this._connectionPoolDataSourse = java.newInstanceSync(this._className, this._config.host, this._config.user, this._config.password);
            this._connectionPool = new ConnectionPool(this._connectionPoolDataSourse, this._config.pool);
        } catch(err) {
            throw err;
        }
    }

    getConnection(callback) {
      return new Promise((resolve, reject) => {
        if(!this._isInitialized()) {
            reject('No se inicializo el driver');
        }

        this._connectionPool.getConnection()
          .then(connection => {
            resolve(connection);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
}

export default ConnectionPoolDataSource;
