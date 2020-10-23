export abstract class BaseController {
  abstract async index(...args: any[]): any;

  abstract async store(...args: any[]): any;

  abstract async delete(...args: any[]): any;

  abstract async update(...args: any[]): any;

  abstract async show(...args: any[]): any;
}
