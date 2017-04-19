declare module 'node-fetch' {
  declare export default function fetch(input: string , init?: { [string]: any }): Promise<Response>
  declare export class Headers {
    constructor(headers: { [string]: any }): any
  }
}
