import DB2JT400Error from '../error/DB2JT400Error';
import DataTypes from '../codes/DataTypes';
import events from 'events';
import S from 'string';

class Connection extends events.EventEmitter {

  constructor(connection) {
    super();
    this._className = "com.ibm.as400.access.AS400JDBCConnection";
    this._connection = connection;

    this._id = this._connection.getServerJobIdentifierSync();
  }

  close() {
    this._connection.close();
    this.emit('closeConnection', this);
  }

  get id() {
        return this._id;
  }

  executeQuery(sqlQuery, values) {
    values = values || [];
    this._connection.setAutoCommitSync(true);
    return this._prepareStatement(this._connection, sqlQuery, values);
  }

  execute(sqlQuery, values) {
    this._connection.setAutoCommitSync(true);
    return this._prepareStatementUpdate(this._connection, sqlQuery, values);
  }

 _prepareStatement(connection, sql, values) {
   let self = this;
   return new Promise((resolve, reject) => {
     connection.prepareStatement(sql, function(err, statement){
       if(err) {
         reject(new DB2JT400Error(err.cause.getMessageSync()));
       }

       try {
         self._setParametersToStatement(statement, values);

         statement.executeQuery(function(er, resultSet) {
           if(er) {
             reject(new DB2JT400Error(er));
           }

           self._getResultsFromResultSet(resultSet)
               .then((result) => {
                 resolve(result);
               })
               .catch((error) => {
                 reject(error);
               });
             });

            } catch(e) {
                reject(new DB2JT400Error(e));
            }
        });
      });
  }

  _prepareStatementUpdate(connection, sql, values) {
        var self = this;

        return new Promise((resolve, reject) => {

          connection.prepareStatement(sql, function(err, statement){
              if(err) {
                  reject(new DB2JT400Error(err));
              }

              try {
                  self._setParametersToStatement(statement, values);

                  statement.executeUpdate(function(er, resultCode) {
                      if(er) {
                          reject(new DB2JT400Error(er));
                      }

                      resolve(resultCode);
                  });

              } catch(e) {
                  reject(new DB2JT400Error(e));
              }
          });

        });
    }

   _setParametersToStatement(statement, parameters) {
        try {
            for (let i = 1; i <= parameters.length; i++) {
                statement.setObjectSync(i, parameters[i - 1]);
            }
        } catch(e) {
            throw new DB2JT400Error(e);
        }
    }

    _getResultsFromResultSet(resultSet) {
      let self = this;

      return new Promise((resolve, reject) => {
        //Si no existen datos retorno vacio
        if(!resultSet) {
            resolve([]);
        }

        resultSet.getMetaData(function(err, rsmd){
            if(err) {
                reject(err);
            }

            try {
                let results = self._getCollection(resultSet, rsmd);
                resolve(results);

            } catch(err) {
                reject(err);
            }
        });
      });
    }

    _getCollection(resultSet, rsmd) {
        //Contiene la informacion de resultado
        let results = [];

        try {
             // build a results array object.
              let cc = rsmd.getColumnCountSync();
              let next = resultSet.nextSync();

              // loop over all the result rows.
              while (next) {
                // create an object out of the row.
                let row = {};

                for (let i = 1; i <= cc; i++) {
                  let colname = rsmd.getColumnNameSync(i);
                  row[colname.toLowerCase()] = this._getValueResultSet(resultSet, rsmd, i);
                }

                // add the row object to the results array.
                results.push(row);

                // increment the pointer to the next row.
                next = resultSet.nextSync();
              }

              return results;

        } catch(err) {
            throw new DB2JT400Error(err);
        }
    }

    _getValueResultSet(resultSet, rsmd, i) {
        switch(rsmd.getColumnTypeSync(i)) {
                case DataTypes.INTEGER.valueOf(): return resultSet.getIntSync(i);
                case DataTypes.FLOAT.valueOf(): return resultSet.getFloatSync(i);
                case DataTypes.VARCHAR.valueOf(): return S(resultSet.getStringSync(i)).trim().s;
                case DataTypes.DATE.valueOf():
                case DataTypes.TIME.valueOf():
                    return new Date(S(resultSet.getStringSync(i)).trim().s);
                default: return S(resultSet.getStringSync(i)).trim().s;
        }
    }

    destroy() {
        delete(this._connection);
        delete(this.domain);
        delete(this._events);
        delete(this._maxListeners);
        delete(this._className);
    }
}

export default Connection;
