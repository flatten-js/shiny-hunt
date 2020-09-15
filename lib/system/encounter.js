import * as utils from '~/utils.js'
import PokeDEX from './pokedex.js'

export default class Encounter {
  constructor(tsv, appearances, rate) {
    this.tsv = tsv
    this.appearances = appearances
    this.rate = rate || 10
    this.current = {}
    this.limit = 0
  }

  get encount() {
    return this.current
  }

  get msg() {
    return `A wild ${this.encount.name} appeared!`
  }

  get _randomByte() {
    return utils.randomBytes()[0]
  }

  test() {
    if (this.limit-- > 0) return false
    if (this._randomByte < this.rate) return this._encount()
    return false
  }

  createPID() {
    return utils.randomBytes2().map(Number)
  }

  createPSV(pid) {
    return parseInt((pid[0] ^ pid[1]).toString(2).substr(0, 13), 2)
  }

  prob(x) {
    return 255 * x
  }

  _encount() {
    this.limit = 3
    this.current = this._appearance()
    return true
  }

  _appearance() {
    const pid = this.createPID()
    const psv = this.createPSV(pid)
    const target = this._target()
    const master = PokeDEX.find('name', target.name)

    const bit32 = utils.toNary(pid, 2)

    return {
      ...target,
      ...master,
      pid: utils.toNary(parseInt(bit32, 2), 16),
      psv: psv,
      sex: this._sex(master.limen, utils.toBytes(bit32, 1)),
      ability: this._ability(master.ability, bit32),
      shiny: this._shiny(this.tsv, psv)
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

  _shiny(tsv, psv) {
    return tsv === psv
  }
}
