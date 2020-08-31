import crypto from 'crypto'

Object.defineProperty(Array, 'fromAll', {
  value: function(array) {
    return Array.from(array).reduce((acc, cur) => {
      acc.push(Array.isArray(cur) ? Array.fromAll(cur) : cur)
      return acc
    }, [])
  }
})

Object.defineProperty(Array.prototype, 'reduceWhile', {
  value: function(cb, initial) {
    const o = Object(this)
    let value = initial
    let i = 0

    while(i < o.length) {
      value = cb(value, o[i])
      if (value.halt) {
        value = value.halt
        break
      }
      i++
    }
    return value
  }
})

const _randomBytesHelper = (buf) => {
  return Array.from(crypto.randomFillSync(buf))
}

const _toBit32Helper = (byte4) => {
  return zeroFill(32, toNAry(byte4, 2))
}

const _toBytes2Helper = (bit32) => {
  return toBytes(bit32, 2).map(b16 => zeroFill(5, b16))
}


export const randomBytes = (n = 1) => {
  return _randomBytesHelper(new Uint8Array(n))
}

export const randomBytes4 = (n = 1) => {
  return _randomBytesHelper(new Uint32Array(n))
}

export const randomBit32 = () => {
  const [byte4] = randomBytes4()
  return _toBit32Helper(byte4)
}

export const toBit32 = (byte4) => {
  return _toBit32Helper(byte4)
}

export const randomBytes2 = () => {
  const bit32 = randomBit32()
  return _toBytes2Helper(bit32)
}

export const toBytes2 = (bit32) => {
  return _toBytes2Helper(bit32)
}

export const toBytes = (bit, n) => {
  const reg = new RegExp(`.{${n*8}}`, 'g')
  return bit.match(reg).map(b => parseInt(b, 2))
}

export const zeroFill = (digit, n) => {
  return (Array(digit).join('0') + n).slice(-digit)
}

export const toNAry = (n, x) => {
  return n.toString(x)
}
