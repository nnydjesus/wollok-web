export default {
    name: 'ejemplo',
    toggled: true,
    extension:"directory",
    children: [
        { name: 'contador.wlk', dirty:true, text:`

class Contador {
  var valor = 0

  method inc() { 
    valor +=  1  
  }
}
`, extension:"wtest"},

{ name: 'main.wpgm', dirty:true, text:`

program Ejemplo {
  var variable = 'Hello Wollok'
 	 console.println(variable) 
}

`, extension:"wpgm"},

        { name: 'pepita.wlk', dirty:false,  text:`
object pepita  {
  var _energia = 100 
  var nombre = "Pepa"

  method comer(gramos) {
    _energia += 4
  }

  method volar(km) {
    _energia -= (10 + km)
  }

  method energia() { return _energia }

  method estaFeliz() { return self.energia().between(50,1000) }
}   
`, extension:"wlk"},

{ name: 'errores.wlk', dirty:true, text:`

object Errores {

  const Constante = "Hello" 

  method prueba1(Param) {
    Constante = ""
    self = Param 
    self.noExiste()
  }
 
}

class masErrores {

  constructor() {
  
  }
  
  constructor() {
  
  }
  
}
`, extension:"wlk"},

    ]
}