import "@fastify/cookie"
import "fastify"

declare module "fastify" {
  interface FastifyReply {
    cookie: (
      name: string,
      value: string,
      options?: import("@fastify/cookie").CookieSerializeOptions
    ) => FastifyReply
  }
}
