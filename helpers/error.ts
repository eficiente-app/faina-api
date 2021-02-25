import HelperMessage from "@helpers/message";

class HelperError {
  private msg: HelperMessage;

  constructor (msg: HelperMessage) {
    this.msg = msg;
  }

  public create (msg: string) {
    throw new Error (msg);
  }

  public fieldsNotSentToEdit () {
    throw new ErrorValidation (this.msg.fieldsNotSentToEdit());
  }

  public notFoundForRead () {
    throw new ErrorValidation (this.msg.notFoundForRead());
  }

  public notFoundForUpdate () {
    throw new ErrorValidation (this.msg.notFoundForUpdate());
  }

  public notFoundForDelete () {
    throw new ErrorValidation (this.msg.notFoundForDelete());
  }
}
export default HelperError;

export class ErrorValidation extends Error {
  constructor (message: any) {
    super(message);

    this.message = message;
    this.name = "validation";
  }
}
