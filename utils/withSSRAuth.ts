import { AuthTokenError } from './../services/errors/AuthTokenError';
import { destroyCookie, parseCookies } from 'nookies';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export  function withSSRAuth<P>(fn:GetServerSideProps<P>){
   return async (ctx:GetServerSidePropsContext) =>{
    const cookies = parseCookies(ctx);

    if (!cookies['nextauth.token']) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }
    try {
      
      return await fn(ctx);
    } catch (error) {
if(error instanceof AuthTokenError){
  destroyCookie(ctx, 'nextauth.token');
  destroyCookie(ctx, 'nextauth.refreshToken');
  return {
      redirect: {
          destination: '/',
          permanent: false
      }
    }
  }  
}

   }
}