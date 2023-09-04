declare module 'js-cookie' {
  export function set(name: string, value: string, options?: any): void;
  export function get(name: string): string | undefined;
  export function remove(name: string): string | undefined;
}