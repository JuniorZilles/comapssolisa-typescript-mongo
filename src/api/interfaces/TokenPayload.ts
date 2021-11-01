export default interface TokenPayload {
  content: {
    id:string;
    habilitado:string;
    email:string;
  };
  iat:number;
  exp: number;
}
