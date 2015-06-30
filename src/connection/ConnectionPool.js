import java from 'java';
import Connection from './Connection';
import DB2JT400Error from '../error/DB2JT400Error';

class ConnectionPool {

  constructor(connectionPoolDataSourse) {
    this._className = "com.ibm.as400.access.AS400JDBCConnectionPool";
    this._connectionPoolDataSourse = connectionPoolDataSourse;
    this._connectionPool = java.newInstanceSync(this._className, this._connectionPoolDataSourse);
    this._connections = [];
  }

  getConnection() {

    let self = this;

    return new Promise((resolve, reject) => {
         this._connectionPool.getConnection((err, connection) => {
             if(err) {
                 return reject(new DB2JT400Error(err.cause.getMessageSync()));
             }

             let instanceConnection = new Connection(connection, self);
             self._connections[instanceConnection.id] = instanceConnection;
             resolve(instanceConnection);
         });
    });
  }

  closeConnection(connection) {
       connection._connection.closeSync();
       connection.destroy();
       delete(this._connections[connection.getId()]);
   }
}

export default ConnectionPool;
