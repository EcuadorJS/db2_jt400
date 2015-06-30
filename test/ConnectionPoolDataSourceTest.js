import ConnectionPoolDataSource from '../src/connection/ConnectionPoolDataSource';
import Connection from '../src/connection/Connection';
import expect from 'expect.js';
let config = require('../secret/config.json');

describe('ConnectionPoolDataSource', function(){
  let connectionPoolDataSource;

  it('should give instance of ConnectionPoolDataSource', function() {
    /**
    * config = {
      "host": "hostname",
      "user": "username",
      "password": "password"
    }
    */
    connectionPoolDataSource = new ConnectionPoolDataSource(config);

    expect(connectionPoolDataSource).to.be.a(ConnectionPoolDataSource);
  });

  it('should give new instance of Connection', function() {
    return connectionPoolDataSource.getConnection()
      .then(connection => {
        expect(connection).to.be.a(Connection);
      })
      .catch(error => {
        console.log(error.message);
      });
  });

  it('should give data result from query', function() {
    return connectionPoolDataSource.getConnection()
      .then(connection => {
        return connection.executeQuery("SELECT * FROM TMPTPRUNODE");
      })
      .then((result) => {
        expect(result).not.to.equal(null);
        expect(result).to.be.an('array');
      })
      .catch(error => {
        console.log(error.message);
      });
  });

  it('should give data result from query conditional', function() {
    return connectionPoolDataSource.getConnection()
      .then(connection => {
        return connection.executeQuery("SELECT * FROM TMPTPRUNODE WHERE tipo = ? and nivelgrasa = ?", ['Verdura',"2"]);
      })
      .then((result) => {
        expect(result).not.to.equal(null);
        expect(result).to.be.an('array');
      })
      .catch(error => {
        console.log(error.message);
      });
  });
});
