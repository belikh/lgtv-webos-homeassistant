declare module 'webos-service' {
  export default class Service {
    constructor(id: string);
    register(name: string, callback: (message: { payload: any; respond: (payload: any) => void }) => void): void;
    call(url: string, params: any, callback: (message: { payload: any }) => void): void;
    subscribe(url: string, params: any): any;
  }
}
