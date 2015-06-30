class DB2JT400Error extends Error {

  constructor(message) {
    super();
    this.name = "DB2JT400Error";
    this.message = message;
  }
}

export default DB2JT400Error;
