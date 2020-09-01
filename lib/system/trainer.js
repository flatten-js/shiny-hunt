import * as utils from '~/utils.js'

export default class Trainer {
  constructor(name) {
    this.tid = this.createTID()
    this.name = name
    this.started = utils.now()
  }

  createTID() {
    return utils.randomBytes2()
  }
}
