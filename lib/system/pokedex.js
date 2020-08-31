class PokeDEX {
  constructor() {}

  get masters() {
    return [
      {
        name: 'A52',
        limen: 0.75,
        ability: ['ability-1', 'ability-2']
      },
      {
        name: 'B52',
        limen: 0.5,
        ability: 'ability-1'
      }
    ]
  }

  find(key, val) {
    return this.masters.find(master => master[key] === val)
  }
}

export default new PokeDEX()
