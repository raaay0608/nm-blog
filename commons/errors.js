
class DatabaseNotConnectedError extends Error {
  constructor(message, statusCode = 503) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

class ResourceNotFoundError extends Error {
  constructor(message, statusCode = 404) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

class UnprocessableRequestError extends Error {
  constructor(message, statusCode = 422) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

module.exports = {
  DatabaseNotConnectedError,
  ResourceNotFoundError,
  UnprocessableRequestError,
};
