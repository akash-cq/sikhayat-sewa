class CustomAppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "CustomAppError";
  }
}
export default CustomAppError;