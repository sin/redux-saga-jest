export const METHOD = '@@redux-saga-jest/method'
export const NEXT = 'next'
export const THROW = 'throw'
export const RETURN = 'return'

export const next = (data) => ({ [METHOD]: NEXT, data })
export const error = (data) => ({ [METHOD]: THROW, data })
export const cancel = (data) => ({ [METHOD]: RETURN, data })
