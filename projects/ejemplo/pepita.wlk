
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
