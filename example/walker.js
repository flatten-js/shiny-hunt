import blessed from 'blessed'
import contrib from 'blessed-contrib'

import * as utils from '~/utils.js'

import Trainer from '~/system/trainer.js'
import Route from '~/system/route.js'

const screen = blessed.screen({
  smartCSR: true,
  fullUnicode: true,
  dockBorders: true,
  title: 'Shiny Hunt TUI'
})

const grid = new contrib.grid({
  screen,
  rows: 20,
  cols: 20
})

const color = {
  white: 'white',
  gray: 'gray',
  black: 234
}

const preset = (label) => ({
  parent: screen,
  label: ` ${label} `,
  border: 'line',
  width: '100%',
  height: '100%',
  style: {
    fg: color.white,
    bg: color.black,
    border: {
      fg: color.white,
      bg: color.black,
    },
    label: {
      fg: color.white,
      bg: color.black,
    },
    selected: {
      fg: color.black,
      bg: color.white,
    }
  }
})

/*
 * Trainers Card Widget
 */

const trainersCardWidget = grid.set(0, 0, 6, 10, blessed.box, {
  ...preset("TRAINER'S CARD")
})

const trainer = new Trainer('Shiny Hunt TUI')

trainersCardWidget.pushLine(`Name: ${trainer.card.name}`)
trainersCardWidget.pushLine(`ID: ${trainer.card.tid[0]}`)
trainersCardWidget.pushLine(`SID: ${trainer.card.tid[1]}`)
trainersCardWidget.pushLine(`TSV: ${trainer.card.tsv}`)

/*
 * Data Widget
 */

const dataWidget = grid.set(5, 0, 5, 10, blessed.box, {
  ...preset('Data')
})

dataWidget.template = {}

dataWidget.templateLine = (i, name, template, initial) => {
  dataWidget.template[name] = { i, template }
  dataWidget.updateTemplate(name, initial)
}

dataWidget.updateTemplate = (name, val) => {
  const { i, template } = dataWidget.template[name]
  dataWidget.spliceLine(i, template.replace('#', val))
}

dataWidget.spliceLine = (i, line) => {
  if (dataWidget.getLine(i)) dataWidget.deleteLine(i)
  dataWidget.insertLine(i, line)
}

const data = {
  steps: 0,
  encount: 0,
  shiny: 0
}

dataWidget.templateLine(0, 'steps', 'Steps: #', data.steps)
dataWidget.templateLine(1, 'encount', 'REs: #', data.encount)
dataWidget.templateLine(2, 'shiny', 'Shiny: #', data.shiny)

/*
 * Appearance List Widget
 */

const appearanceListWidget = grid.set(10, 0, 10, 10, contrib.table, {
  keys: true,
  columnSpacing: 5,
  columnWidth: [3, 5, 4, 4],
  ...preset('Appearance List')
})

const appearances = [
  { uid: 1, level: 3, name: 'A52', rate: 0.25 },
  { uid: 2, level: 3, name: 'B52', rate: 0.25 },
  { uid: 3, level: 2, name: 'B52', rate: 0.2 },
  { uid: 4, level: 4, name: 'A52', rate: 0.15},
  { uid: 5, level: 4, name: 'B52', rate: 0.1 },
  { uid: 6, level: 5, name: 'A52', rate: 0.05 }
]

appearanceListWidget.setData({
  headers: Object.keys(appearances[0]),
  data: appearances.map(appearance => Object.values(appearance))
})

/*
 * Map Widget
 */

const route = new Route('Route 1')

const mapWidget = grid.set(0, 10, 12, 10, blessed.box, {
  ...preset(route.label)
})

mapWidget.spliceLine = (i, line) => {
  if (mapWidget.getLine(i)) mapWidget.deleteLine(i)
  mapWidget.insertLine(i, line)
}

mapWidget.setIndex(0)

route.to = (rows, i) => {
  mapWidget.spliceLine(i, rows.join(''))
}

/*
 * Log Widget
 */

const logWidget = grid.set(11, 10, 9, 10, blessed.log, {
  ...preset('Log'),
  keys: true,
  scrollOnInput: true,
  scrollbar: {
    ch: ' ',
    track: {
      bg: color.gray
    },
    style: {
      bg: color.white
    }
  }
})

logWidget.formatLog = (...log) => {
  log = [].concat(...log)
  logWidget.log(`[${utils.now('HH:mm:ss')}]:`, log[0])
  for(let i = 1; i < log.length; i++) logWidget.log(log[i])
}

logWidget.focus()
logWidget.setIndex(1)

/*
 * Events
 */

screen.key('C-c', () => process.exit())

trainer.toLocation(route, appearances)

screen.key(trainer.input, (ch, key) => {
  trainer.move(key, encount => {
    dataWidget.updateTemplate('steps', data.steps += 1)

    if (!trainer.grass) return
    encount()
    .then(encounter => {
      logWidget.formatLog(encounter.msg, encounter.encount)
      dataWidget.updateTemplate('encount', data.encount += 1)

      if (!encounter.encount.shiny) return
      dataWidget.updateTemplate('shiny', data.shiny += 1)
    })
    .catch(() => {
      logWidget.formatLog('...')
    })
  })

  trainer.render()
  screen.render()
})

trainer.render()
screen.render()
