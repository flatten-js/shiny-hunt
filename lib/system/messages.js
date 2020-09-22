import * as utils from '~/utils.js'
import readline from 'readline'

export default class Messages {
  constructor(messages) {
    this.messages = messages
    this.runtime = null
    this.running = false
    this.skip = false
    this._output = word => process.stdout.write(word)
    this._clear = text => {
      for (let i = 0; i < text.length; i++) {
        readline.moveCursor(process.stdout, -999, i && -1)
        readline.clearLine(process.stdout)
      }
    }
  }

  set output(cb) {
    this._output = cb
  }

  set clear(cb) {
    this._clear = cb
  }

  _init(cb) {
    this.runtime = null
    cb()
  }

  start(name) {
    const message = this.messages[name]
    this.runtime = {
      gen: this.message(message.list || message),
      end: message.end || this._end
    }
    this.next()
  }

  _end(init) {
    init()
  }

  next(cb) {
    if (!this.runtime) return
    if (this.running) return this.skip = true
    if (this.runtime.gen.next().done) {
      this.runtime.end(this._init.bind(this, cb))
    }
  }

  * message(list, continual = false) {
    for (const text of list) {
      if (Array.isArray(text)) {
        yield * this.message(text, true)
      } else {
        yield this.text(text)
      }

      if (!continual) this.clearLines(text)
    }
  }

  clearLines(text) {
    text = [].concat(text).join('')
    this._clear(text.split(/\//g))
  }

  async text(str) {
    this.running = true
    for (const word of [...str]) {
      this._output(word.replace('/', '\n'))
      if (this.skip) continue
      await utils.wait(50)
    }
    this.running = false
    this.skip = false
  }
}
