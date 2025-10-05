import "server-only"
import { stackServerApp } from "@stackframe/stack"

export const stack = stackServerApp({
  tokenStore: "nextjs-cookie",
})
