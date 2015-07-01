import Connection from './Connection';
import DB2JT400Error from '../error/DB2JT400Error';
import events from 'events';
import java from 'java';

class ConnectionPool extends events.EventEmitter {

  constructor(connectionPoolDataSourse, configPool) {
    super();
    this._className = "com.ibm.as400.access.AS400JDBCConnectionPool";
    this._connectionPoolDataSourse = connectionPoolDataSourse;
    this._connectionPool = java.newInstanceSync(this._className, this._connectionPoolDataSourse);
    this._connections = [];
    this._initConfig(configPool);
  }

  _initConfig(configPool) {
    configPool = configPool || {};

    if(configPool.fill !== undefined) {
      this.fill(configPool.fill);
    }

    if(configPool.maxLifeTime !== undefined) {
      this.setMaxLifetime(configPool.maxLifeTime);
    }
  }

  getConnection() {

    let self = this;

    return new Promise((resolve, reject) => {
         this._connectionPool.getConnection((err, connection) => {
             if(err) {
                 return reject(new DB2JT400Error(err.cause.getMessageSync()));
             }

             console.log("Se Abrio una coneecion con id: " + connection.getServerJobIdentifierSync());
             let instanceConnection = new Connection(connection);
             self._connections[instanceConnection.id] = instanceConnection;
             instanceConnection.on('closeConnection', this._closeConnection.bind(this));
             this.emit('openConnection', instanceConnection);
             resolve(instanceConnection);
         });
    });
  }

  close() {
    this._connectionPool.close();
  }

  _closeConnection(connection) {
      //Destroy connection
      connection.destroy();
      //Remove connection
      delete(this._connections[connection.id]);
      console.log(this);
   }

  fill(numConnections) {
    this._connectionPool.fillSync(numConnections);
  }

  /**
  * Sets the maximum life for an available connection
  */
  setMaxLifetime(maxLifeTime) {
    this._connectionPool.setMaxLifetimeSync(maxLifeTime);
  }

  /**
  * Sets the maximum number of connections
  */
  setMaxConnections(maxConnections) {
    this._connectionPool.setMaxConnectionsSync(maxConnections);
  }

  /**
  * Sets the time interval for how often the maintenance daemon is to run
  */
  setCleanupInterval(cleanupInterval) {
    this._connectionPool.setCleanupIntervalSync(cleanupInterval);
  }

  /**
  *  Sets the maximum amount of inactive time before an available connection is to close
  */
  setMaxInactivity(maxInactivity) {
    this._connectionPool.setMaxInactivitySync(maxInactivity);
  }

  /**
  * Sets the maximum number of times a connection can be used before it is to be replaced in the pool
  */
  setMaxUseCount(maxUseCount) {
    this._connectionPool.setMaxUseCountSync(maxUseCount);
  }

  /**
  * Sets the maximum amount of time a connection can be in use before it is to be closed and returned to the pool
  */
  setMaxUseTime(maxUseTime) {
    this._connectionPool.setMaxUseTimeSync(maxUseTime);
  }

  /**
  * Sets whether the Toolbox does periodic maintenance on the connection pool to clean up expired connections
  */
  setRunMaintenance(cleanup) {
    this._connectionPool.setRunMaintenanceSync(cleanup);
  }

  /**
  * Sets whether threads are used in communication with the host servers
  */
  setThreadUsed(useThreads) {
    this._connectionPool.setThreadUsedSync(useThreads);
  }
}

export default ConnectionPool;
