declare module 'fabric' {
  export const fabric: any;
}

declare global {
  type Window = {
    fabric: any;
  };
}
