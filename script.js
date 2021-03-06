// zona de variables
var vOpciones;
var vMenu;
var vJuego;
var centro;
var jugadores;
var baraja;
var dineroTotal = 0;
var k = 0;    //k identifica el turno del jugador
var ronda = 1;
// esta funcion se declara en el html, tomando los valores para contruir la visualización.
function construir() {
  construirVistas();
  baraja = llenarBaraja();
  mostrar(vMenu);
}
//en esta funcion arrancamos el juego, esta hereda desde validarImput() al precionar el botón.
function iniciar() {
  ocultar(vMenu);
  var n = parseInt(document.getElementById('inpJ').value);
  jugadores = llenarJugadores(n);
  actualizarJugadores(n);
  mostrar(vJuego);
  mostrar(vOpciones);
  sombrear(k);
}
// aqui se valida el Imput y se controla que el usuario solo pueda ingresar numeros entre 2 y 10.
function validarInput() {
  var numero=document.getElementById('inpJ').value;
  if (numero<=10&&numero>=2) {
    iniciar();
  }else {
    alert("Debe introcucir numeros del 2 al 10");
    window.location.reload();
    return document.getElementById('inpJ').value=2;
  };
}
// manejo de la visualizacion de la mesa.
function construirVistas() {
  vMenu = document.getElementById('vMenu');
  vJuego = document.getElementById('vJuego');
  vOpciones = document.getElementById('vOpciones');
  centro = document.getElementById('centro');
}
//herencia de familia hacia carta.
function Familia(sNombre) {
  this.familia = sNombre;
}

function Carta(sFamilia,sNombre,iValor){// atributos de cartas 
  Familia.call(this,sFamilia);
  this.nombre = sNombre;
  this.valor = iValor;
}
// se busca la imagen para mostrar
Carta.prototype = new Familia();
Carta.prototype.obtenerDireccion = function() {
  var direccion = "images/"+this.familia+"/"+this.valor+".png";
  return direccion;
};
// se crean arreglos para cada familia de cartas
function llenarFamilia(sFam) {
  var a = new Array();
    for (var nombre = 2; nombre <= 10; nombre++) {
      var oCarta = new Carta(sFam,nombre,nombre);
      a.push(oCarta);
    }
    var oJ = new Carta(sFam,"J",11);
    a.push(oJ);
    var oQ = new Carta(sFam,"Q",12);
    a.push(oQ);
    var oK = new Carta(sFam,"K",13);
    a.push(oK);
    var oA = new Carta(sFam,"A",14);
    a.push(oA);
    return a;
}
// se crea un bucle para llenar un array con la clase jugador definida desde html en el menu de usuario
function llenarJugadores(n) {
  var aJugadores = new Array();
  for (var i = 0; i < n; i++) {
    var oJugador = new Jugador();
    oJugador.repartir();
    aJugadores.push(oJugador);
  }
  return aJugadores;        //devuelve un arreglo con los jugadores
}

function Jugador() {
  this.dinero = 2000;                  //dinero inicial
  this.mano;
}
// usamos prototype para crear una funcion que nos identifique la mano del jugador
//por medio de un arreglo.
Jugador.prototype.repartir = function(aComunes) {
  if (typeof this.mano == "undefined") {
    this.mano = new Array();
    for (var i = 0; i < 2; i++) {
      this.mano.push(sacarCarta());
    }
  }else {
    this.mano = this.mano.concat(aComunes);
  }
};
// en esta función mostramos una carta, recorremos el arreglo y obtenemos la direccion de la imagen
function flop(){
  var a = new Array();
  for (var i = 0; i < 3; i++) {
    a.push(sacarCarta());
    var img = nuevaImagen(a[i].obtenerDireccion());
    centro.appendChild(img);
  }
  return a;
}

// anidando las funciones recorremos un arreglo para obtener una nueva carta
function nuevaCarta(){
  var a = new Array();
  a.push(sacarCarta());
  var img = nuevaImagen(a[0].obtenerDireccion());
  centro.appendChild(img);
  return a;
}
// es esta funcion creamos una clase jugador y agregamos una lista a html dependiendo la cantidad 
// de jugadores asi se definira elradio de la mesa para posicionar las cartas.
function actualizarJugadores() {
  var n = jugadores.length;
  var l = document.getElementsByClassName('jugador').length;
  var ul = document.getElementById('ls');
  var radianes = Math.PI;
  var h = 2*Math.PI/n;    //distancia angular entre elemntos;

  for (var i = 0; i < n; i++) {
    var li = document.createElement('li');
    li.setAttribute("class","jugador");
    for (var j = 0; j <= 1;j++) {
      var img = nuevaImagen("images/back.png");
      li.appendChild(img);
    }
    rotar(li,radianes);
    posicionarEnCirculo(li,radianes,200,200,20);
    radianes += h;

    if (l == 0) {
      ul.appendChild(li);
    }else {
      ul.replaceChild(li , ul.childNodes[i]);
    }
    mostrarJugador();
  }

}
// por medio de la clase jugador volvemos a crear elementos a una lista en html
// esta vez para mostrar las mano del jugador.
function mostrarJugador() {
  var ul = document.getElementById('ls');
  var radianes = posicionDeJugador();

  var li = document.createElement('li');
  li.setAttribute("class","jugador");

  for (var j = 0; j <= 1;j++) {
    var img = nuevaImagen(jugadores[k].mano[j].obtenerDireccion());
    li.appendChild(img);
  }
  rotar(li,radianes);
  posicionarEnCirculo(li,radianes,200,200,20);
  ul.replaceChild(li , ul.childNodes[k]);
  sombrear(k);
  return radianes;
}
// funcion angular para colocar a los jugadores en la mesa
function posicionDeJugador() {
  var n = jugadores.length;
  var radianes = Math.PI;     //valor inicial
  var h = 2*Math.PI/n;    //distancia angular entre elemntos;
  for (var i = 0; i < k; i++) {
    radianes += h;
  }
  return radianes;
}

// se agrega propiedad al css para que rote las cartas dependiendo su posicion
function rotar(o,fRadianes) {
    o.style.transform = "rotate("+fRadianes+"rad)";   //recibe el objeto a rotar y los grados que se le van a aplicar
}
// se usa esta funcion para colocar en la ventana la figura circular de perimetro de cartas
function posicionarEnCirculo(o,fRadianes,r,b,a) {
    //objeto,distancia angular,radio,desplazamiento en x,desplazamiento en y
    var x = Math.ceil(r+r*Math.sin(fRadianes));        //equacion para el atributo top
    var y = Math.ceil(r-r*Math.cos(fRadianes));        //equacion para el atributo left
    x += 195*Math.sin(fRadianes);                    //estira en x
    x+=b;                                       //b desplazamiento en x
    y+=a;                                       //a desplazamiento en y
    o.style.left = x+"px";
    o.style.top = y+"px";
}

// lenamos las barajas con su respectiva familia
function llenarBaraja() {
  var aBaraja = new Array();
  aBaraja = aBaraja.concat(llenarFamilia("diamantes")); //
  aBaraja = aBaraja.concat(llenarFamilia("corazones"));
  aBaraja = aBaraja.concat(llenarFamilia("treboles"));
  aBaraja = aBaraja.concat(llenarFamilia("espadas"));
  return aBaraja
}
// para entregar cartas aleataoriamente a los jugadores
function sacarCarta() {
  //asigna la cantidad actual de cartas disponibles
  var n = baraja.length;
  //genera un numero aleatorio de entre(n-1)opciones
  var indx = Math.floor(Math.random()*(n-1));
  //crea una copia del contenido de baraja en la posicion index
  var carta = baraja[indx];
  //elimina el elemento de la baraja, para que no se vuelva a asignar
  baraja.splice(indx,1);
  return carta;
}


//funcion para validar solo numeros enteros
function soloNumeros( evt ){
  if ( window.event ) {
    keyNum = evt.keyCode;
  } else {
    keyNum = evt.which;
  }
  if ( keyNum >= 48 && keyNum <= 57 ) {
    return true;
  } else {
    return false;
  }
}

function ocultar(elemento) {
  elemento.style.display = "none";
  /* style.display:establece la propiedad de visualización del elemento al valor predeterminado,
  es decir que elimina la visualización y luego la reestablece en linea tomando en cuenta
  que esto es establecido en el CSS*/
}
// esta funcion altera cambios directos a css
function mostrar(elemento) {
  elemento.style.display = "block";
}

// funcion pasar durante el juego
function pasar() {
  verificarRonda();
  actualizarJugadores();
  verificarManoGanadora();
}
// agregamos sombra a lacarta de jugador activo
function sombrear(i) {
  var ul = document.getElementsByClassName('jugador'); //los divs que corresponden al jugador
  ul[i].style.boxShadow = "0px 0px 45px rgba(255, 1, 255, 0.8)";
}
//hacemos una comparacion entre los jugadores
function verificarManoGanadora() {

  var mano = jugadores[k].mano;
  verificarEscalera(mano);

  if (esMismaFam(mano)) {
    alert("tienes una familia");
  }
  cuantasIguales(mano);
}
//usamos un switch para definir si el jugador tiene trios o pares en su mano para ganar

function cuantasIguales(aMano) {
    var a = obtenerValores(aMano).sort();
    var pares = 0;
    var trio = false;
    var iguales;
    for (var i = 0; i < 5; i++) {
      iguales = 0;
      for (var j = (i+1); j < a.length-1; j++) {
        if (a[i] == a[j]) {
          iguales++;
        }
      }
      switch (iguales) {
        case 1:
            pares++;
          break;
        case 2:
            pares--;
            trio = true;
          break;
        case 3:
            trio = false;
            alert("Tienes un poker");
          break;
      }
    }
    if (pares>0) {
      alert("Tienes "+pares+" par");
    }
    if (trio) {
      alert("Tienes un trio");
    }

}





