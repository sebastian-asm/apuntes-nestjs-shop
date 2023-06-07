import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const RawHeaders = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const { rawHeaders } = ctx.switchToHttp().getRequest()
    return rawHeaders
  }
)
