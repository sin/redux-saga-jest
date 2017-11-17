import matchers from './matchers'
import runSaga from './runSaga'
import { next, error, cancel } from './methods'

expect.extend(matchers)

export default runSaga
export {
    next,
    error,
    cancel,
    error as throwNext,
    cancel as returnNext
}