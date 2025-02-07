class ApiResponse {
    constructor({ msg = '', data = null, success = true, statusCode = 200 } = {}) {
      this.msg = msg;
      this.data = data;
      this.success = success;
      this.statusCode = statusCode;
    }
  }
  
module.exports = ApiResponse;
  