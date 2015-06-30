class FileNotExistError extends Error {

  constructor(message) {
    super();
    this.name = "FileNotExistError";
    this.message = message;
  }
}

export default FileNotExistError;
