class HttpException {
  constructor(private errorMessage: string, private errorCode: number, public statusCode: number) {}

  format = () => {
    return {
      errorMessage: this.errorMessage,
      errorCode: this.errorCode,
    };
  };
}

export { HttpException };
