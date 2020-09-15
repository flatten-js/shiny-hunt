import * as utils from '~/utils.js'
import Encounter from './encounter.js'

export default class Trainer {
  constructor(name, keys = {}) {
    this._tid = this.createTID()
    this._name = name
    this.location = {}
    this.keys = {
      top: keys.top || 'w',
      left: keys.left || 'a',
      bottom: keys.bottom || 's',
      right: keys.right || 'd'
    }
  }

  get card() {
    return {
      tid: this._tid,
      name: this._name
    }
  }

  get input() {
    return Object.values(this.keys)
  }

  get gps() {
    const { route, current: { y, x } } = this.location
    return { route, y, x }
  }

  get grass() {
    const { route, y, x } = this.gps
    return route.model[y][x] === 1
  }

  createTID() {
    return utils.randomBytes2()
  }

  toLocation(route, appearances, current) {
    this.location = {
      route: route,
      current: current || { y: 1, x: 1 },
      encounter: new Encounter(this._tid, appearances)
    }
  }

  move(key, cb) {
    const { keys } = this
    const { route, y, x } = this.gps

    switch(key.name) {
      case keys.top:
      if (route.model[y-1][x] > 6) return
      this.location.current.y -= 1
      break

      case keys.left:
      if (route.model[y][x-1] > 6) return
      this.location.current.x -= 1
      break

      case keys.bottom:
      if (route.model[y+1][x] > 6) return
      this.location.current.y += 1
      break

      case keys.right:
      if (route.model[y][x+1] > 6) return
      this.location.current.x += 1
      break

      default:
      return
    }

    cb(this._encount.bind(this))
  }

  _encount() {
    return new Promise((resolve, reject) => {
      if (this.location.encounter.test()) {
        resolve(this.location.encounter)
      } else {
        reject()
      }
    })
  }

  render() {
    const { route, y, x } = this.gps
    const model = Array.fromAll(route.model)
    model[y][x] = 'i'
    route.render(model)
  }
}
