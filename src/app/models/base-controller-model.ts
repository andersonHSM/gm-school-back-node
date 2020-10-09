export abstract class BaseController {
  abstract index(...args: any[]): any;

  abstract store(...args: any[]): any;

  abstract delete(...args: any[]): any;

  abstract update(...args: any[]): any;

  abstract show(...args: any[]): any;
}
