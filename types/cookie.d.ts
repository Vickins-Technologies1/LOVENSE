// types/cookie.d.ts
declare module 'cookie' {
       export function serialize(name: string, val: string, options?: any): string;
       export function parse(cookieHeader: string, options?: any): { [key: string]: string };
     }
     