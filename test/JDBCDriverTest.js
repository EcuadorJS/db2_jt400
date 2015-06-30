import JDBCDriver from '../src/driver/JDBCDriver';
import expect from 'expect.js';

describe('JDBCDriver', function(){

  it('should give instance of JDBCDriver', function() {
    let jt400 = JDBCDriver.instance;

    expect(jt400).to.be.a(JDBCDriver);
  });
});
