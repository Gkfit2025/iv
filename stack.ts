import "server-only"
import { StackServerApp } from "@stackframe/stack"

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/auth/login",
    afterSignIn: "/dashboard",
    afterSignUp: "/dashboard",
    signUp: "/auth/signup",
  },
})
