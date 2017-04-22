declare module 'node-fetch' {
  declare export default function fetch(input: string , init?: { [string]: any }): Response
  declare export function Headers(headers: { [string]: any }): Object
}
