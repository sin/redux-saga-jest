import * as effects from 'redux-saga/effects'

export const effectsList = [
    'take', 'takeEvery', 'takeLatest', 'put', 'call', 'apply', 'fork', 'spawn',
    'all', 'race', 'join', 'cancel', 'cancelled', 'select', 'cps', 'flush', 'throttle'
]

export const getMatcher = (effectName) => {
    if (!effectName || !effects[effectName]) return null

    return function matcher(received, ...args) {
        const effectObject = effects[effectName](...args)
        const pass = this.equals(received, effectObject)

        const hintStr = this.utils.matcherHint(`${pass ? '.not' : ''}.${effectName}`)
        const receivedStr = this.utils.printReceived(JSON.stringify(received))
        const effectStr = this.utils.printExpected(JSON.stringify(effectObject))

        const message = () => pass
            ? `${hintStr}\n\nExpected value not to be (using equals):\n\t${effectStr}\n\nReceived:\n\t${receivedStr}`
            : `${hintStr}\n\nExpected value to be (using equals):\n\t${effectStr}\n\nReceived:\n\t${receivedStr}`

        return { message, pass }
    }
}

export default effectsList.reduce((results, effectName) => ({...results, [effectName]: getMatcher(effectName)}), {})
