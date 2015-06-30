class EnumSymbol {

  constructor(name, {value}) {

      if(!Object.is(value, undefined)) this.value  = value;

      this.sym = Symbol(name);
      Object.freeze(this);
  }

  get display() {
      return this.value || Symbol.keyFor(this.sym);
  }

  toString() {
      return this.sym;
  }

  valueOf() {
      return this.value;
  }
}

export default EnumSymbol;
