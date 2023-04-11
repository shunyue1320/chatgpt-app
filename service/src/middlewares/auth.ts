import { isNotEmptyString } from 'src/utils/is'

const auth = async (ctx, next) => {
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  if (isNotEmptyString(AUTH_SECRET_KEY)) {
    try {
      const Authorization = ctx.headers.authorization
      if (!Authorization || Authorization.replace('Bearer ', '').trim() !== AUTH_SECRET_KEY.trim())
        throw new Error('Error: 无访问权限 | No access rights')

      await next()
    }
    catch (error) {
      ctx.status = 401
      ctx.body = { status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null }
    }
  }
  else {
    await next()
  }
}

export { auth }
