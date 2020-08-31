import * as utils from '~/utils.js'
import PokeDEX from './pokedex.js'

export default class Encounter {
  constructor(tid, appearances, rate) {
    this.tid = tid
    this.appearances = appearances
    this.rate = rate || 10
    this.current = {}
    this.limit = 0
  }

  get str() {
    return `You encountered a wild ${this.encount.name}`
  }

  get encount() {
    return this.current
  }

  get _randomByte() {
    return utils.randomBytes()[0]
  }

  test() {
    if ((this.limit -= 1) > 0) return false
    if (this._randomByte < this.rate) return this._encount()
    return false
  }

  debug() {
    this._encount()
    return this.encount
  }

  createPID() {
    const [byte4] = utils.randomBytes4()
    return utils.zeroFill(8, utils.toNAry(byte4, 16))
  }

  prob(x) {
    return 255 * x
  }

  _encount() {
    this.limit = 3 + 1
    this.current = this._appearance()
    return true
  }

  _appearance() {
    const [id, _id] = this.tid
    const pid = this.createPID()
    const target = this._target()
    const master = PokeDEX.find('name', target.name)

    const bit32 = utils.toBit32(parseInt(pid, 16))
    const [pidByte, _pidByte] = utils.toBytes2(bit32)

    return {
      ...target,
      ...master,
      pid: pid,
      sex: this._sex(master.limen, utils.toBytes(bit32, 1)),
      ability: this._ability(master.ability, bit32),
      shiny: this._shiny((id ^ _id) - (pidByte ^ _pidByte))
    }
  }

  _target() {
    return this.appearances.reduceWhile((acc, cur) => {
      acc += this.prob(cur.rate)
      if (this._randomByte <= acc) return { halt: cur }
      return acc
    }, 0)
  }

  _sex(limen, bytes) {
    const byte = bytes.slice(-1)[0]
    return this.prob(limen) < byte ? 'female' : 'male'
  }

  _ability(ability, bit32) {
    if (!Array.isArray(ability)) return ability
    return ability[bit32.charAt(15)]
  }

  _shiny(flag) {
    return 0 <= flag && flag <= 7
  }
}
