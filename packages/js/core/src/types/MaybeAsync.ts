export type MaybeAsync<T> = Promise<T> | T

export const isPromise = (test: any) => test && typeof test.then === 'function'

export const executeMaybeAsyncFunction = async (func: any, ...args: any[]) => {
  let result = func(...args)
  if (isPromise(result)) {
    result = await result
  }
  return result
}
