declare module 'node-fetch' {
  declare export default function fetch(input: string , init?: { [string]: any }): Promise<Response>
  declare export function Headers(headers: { [string]: any }): any
}
