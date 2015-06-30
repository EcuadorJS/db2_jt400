import EnumSymbol from './EnumSymbol';

class Enum {
    constructor(enumLiterals) {
        for (let key in enumLiterals) {
            if(!enumLiterals[key]) throw new TypeError('cada enumeración debería haber sido inicializado con al menos vacío {} valor');
            this[key] =  new EnumSymbol(key, enumLiterals[key]);
        }
        Object.freeze(this);
    }

    symbols() {
      let symbols = [];
      for(key of Object.keys(this)) {
        symbols = this[key];
      }
      return symbols;
    }

    keys() {
        return Object.keys(this);
    }

    contains(sym) {
        if (!(sym instanceof EnumSymbol)) return false;
        return this[Symbol.keyFor(sym.sym)] === sym;
    }
}

export default Enum;
