import * as utils from '~/utils.js'

export default class I {
  constructor(route, encounter, current, keys = {}) {
    this.route = route
    this.encounter = encounter
    this.keys = {
      top: keys.top || 'w',
      left: keys.left || 'a',
      bottom: keys.bottom || 's',
      right: keys.right || 'd'
    }
    this.current = current || { y: 1, x: 1 }
  }

  get gps() {
    const { route, current } = this
    const { y, x } = current
    return { route, y, x }
  }

  get grass() {
    const { route, y, x } = this.gps
    return route.model[y][x] === 1
  }

  move(key, cb) {
    const { keys } = this
    const { route, y, x } = this.gps

    switch(key.name) {
      case keys.top:
      if (route.model[y-1][x] > 6) return
      this.current.y -= 1
      break

      case keys.left:
      if (route.model[y][x-1] > 6) return
      this.current.x -= 1
      break

      case keys.bottom:
      if (route.model[y+1][x] > 6) return
      this.current.y += 1
      break

      case keys.right:
      if (route.model[y][x+1] > 6) return
      this.current.x += 1
      break

      default:
      return
    }

    cb(this._encount.bind(this))
  }

  _encount() {
    return new Promise((resolve, reject) => {
      if (this.encounter.test()) {
        resolve(this.encounter)
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
