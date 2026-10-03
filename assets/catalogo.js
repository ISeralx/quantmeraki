/* ==========================================================================
   QuantMeraki · catálogo
   Única fuente de verdad para cursos, rutas y etapas del proceso de selección.
   - window.QM_CATALOGO : los datos (cursos, rutas, etapas, fuentes)
   - window.QM_CAT      : ayudas pequeñas para leerlos

   Convenciones
   - Id de curso: fundamentos · avanzados · mercados · activos · juegos ·
     finanzas · programacion · matematicas. Página: curso.html?c=<id>
   - Lección: slug sin acentos. Página: leccion-<slug>.html. Id de hecho: leccion:<slug>
   - Un elemento de ruta lleva href solo si la página existe. Si no, la UI lo
     enseña como borrador (data-soon).
   - Ids de hecho: leccion: · pregunta: · preguntas: · juego: · entrenador: ·
     prueba: · guia: · codigo: · video: · curso:. Un elemento puede fijar su
     propio id con `done` (por ejemplo, el entrenador de cálculo guarda historial,
     no una marca: 'hist:calculo').
   - Se carga antes o después de qm.js, da igual: solo usa window.QM dentro de
     las funciones, nunca al cargar.
   ========================================================================== */
(function(root){
  'use strict';

  /* ---------- ayudas de escritura ---------- */
  function L(slug,titulo,min,resumen,href){return {slug:slug,titulo:titulo,min:min,resumen:resumen,href:href||null};}
  function it(tipo,ref,titulo,min,meta,href,extra){
    var o={tipo:tipo,ref:ref,titulo:titulo,min:min,meta:meta||'',href:href||null};
    if(extra)Object.keys(extra).forEach(function(k){o[k]=extra[k];});
    return o;
  }
  function le(slug,extra){return it('leccion',slug,null,0,'',null,extra);}
  function cu(curso,lecciones,titulo,descripcion){return {tipo:'curso',ref:{curso:curso,lecciones:lecciones},titulo:titulo,descripcion:descripcion||'',min:0,meta:'',href:null};}
  function prueba(firma,slug,tipo,min,extra){
    return it('prueba',slug,firma+' · '+tipo,min,'formato público',null,Object.assign({firma:firma},extra||{}));
  }

  /* =========================================================================
     CURSOS
     ========================================================================= */
  var cursos=[
    {
      id:'fundamentos',
      titulo:'Fundamentos de probabilidad y estadística',
      nivel:'básico',
      descripcion:'Las reglas de la probabilidad, las distribuciones que salen en toda entrevista y la estadística justa para no fiarte de un resultado por casualidad. Es la base de todo lo demás.',
      secciones:[
        {titulo:'Bases de la probabilidad',lecciones:[
          L('reglas-de-probabilidad','Reglas de la probabilidad',11,'Sucesos, uniones e intersecciones: las cuatro reglas con las que se calcula cualquier probabilidad.'),
          L('valor-esperado','Independencia y valor esperado',11,'Cuánto vale un juego antes de jugarlo, y cuándo dos sucesos no se influyen.','leccion-valor-esperado.html'),
          L('varianza-y-desviacion-tipica','Varianza y desviación típica',11,'Dos apuestas con la misma media no valen lo mismo: cómo medir cuánto se desvía el resultado.')
        ]},
        {titulo:'Conjuntos y combinatoria',lecciones:[
          L('metodos-de-conteo','Métodos de conteo',11,'Permutaciones, combinaciones y cuándo importa el orden, sin listar los casos uno a uno.'),
          L('tecnicas-avanzadas-de-conteo','Técnicas avanzadas de conteo',12,'Inclusión-exclusión, barras y estrellas y el complementario, para cuando contar a mano se vuelve imposible.')
        ]},
        {titulo:'Probabilidad condicionada y bayesiana',lecciones:[
          L('probabilidad-condicionada','Probabilidad condicionada',11,'Cómo cambia una probabilidad cuando sabes algo más, y el árbol que lo ordena todo.'),
          L('teorema-de-bayes','Teorema de Bayes',12,'Dar la vuelta a una condicional: del test positivo a la probabilidad de estar enfermo.')
        ]},
        {titulo:'Distribuciones discretas',lecciones:[
          L('bernoulli-y-binomial','Distribuciones de Bernoulli y binomial',11,'Una moneda y muchas monedas: cuántos éxitos esperar y con qué dispersión.'),
          L('poisson-y-geometrica','Distribuciones de Poisson y geométrica',12,'Cuántas órdenes llegan en un minuto y cuántas tiradas hacen falta hasta el primer seis.')
        ]},
        {titulo:'Distribuciones continuas y el teorema central del límite',lecciones:[
          L('uniforme-y-normal','Distribuciones uniforme y normal',11,'De la densidad plana a la campana: áreas, cuantiles y la regla del 68-95-99,7.'),
          L('teorema-central-del-limite','Teorema central del límite',11,'Por qué casi todo lo que se suma acaba pareciendo una normal, y cómo usarlo para aproximar de cabeza.'),
          L('probabilidad-geometrica','Probabilidad geométrica',12,'Cuando «al azar» es un punto en una figura, la probabilidad es un cociente de áreas.','leccion-probabilidad-geometrica.html'),
          L('estadisticos-de-orden','Estadísticos de orden',12,'Varios puntos al azar en un segmento: dónde caen el mayor, el menor y los del medio.','leccion-estadisticos-de-orden.html')
        ]},
        {titulo:'Distribuciones discretas (II)',lecciones:[
          L('binomial-negativa-e-hipergeometrica','Binomial negativa e hipergeométrica',12,'Tiradas hasta el k-ésimo éxito y extracciones sin reemplazo: las dos distribuciones de los acertijos de cartas.')
        ]},
        {titulo:'Herramientas avanzadas de probabilidad',lecciones:[
          L('cadenas-de-markov','Probabilidad con cadenas de Markov',12,'Estados y transiciones: cómo calcular la probabilidad de llegar a un sitio antes que a otro.')
        ]},
        {titulo:'Inferencia frecuentista',lecciones:[
          L('intervalos-de-confianza','Intervalos de confianza',11,'Qué significa de verdad un «95 %» y cómo se construye el intervalo a partir de una muestra.'),
          L('contraste-de-hipotesis','Contraste de hipótesis',11,'Plantear la hipótesis nula, elegir el estadístico y decidir si los datos la contradicen.'),
          L('p-valores','p-valores y decisiones estadísticas',11,'Qué mide un p-valor, qué no mide, y por qué 0,05 no es una ley de la naturaleza.'),
          L('errores-de-tipo-i-y-ii','Errores de tipo I y de tipo II',10,'Falsos positivos, falsos negativos y la potencia de un contraste, con una estrategia de trading de ejemplo.'),
          L('significacion-estadistica-y-practica','Significación estadística frente a práctica',10,'Un efecto puede ser significativo y no valer nada: cómo separar las dos cosas.'),
          L('herramientas-frecuentistas-avanzadas','Herramientas frecuentistas avanzadas',12,'Bootstrap, contrastes múltiples y qué hacer cuando la muestra es pequeña o no es normal.')
        ]},
        {titulo:'Análisis de regresión',lecciones:[
          L('minimos-cuadrados-ordinarios','Mínimos cuadrados ordinarios',12,'Ajustar una recta a una nube de puntos, leer los coeficientes y saber cuándo no fiarse.')
        ]}
      ]
    },
    {
      id:'avanzados',
      titulo:'Temas avanzados de probabilidad y estadística',
      nivel:'intermedio',
      descripcion:'Los trucos que convierten un problema de probabilidad que asusta en una suma corta: indicadoras, condicionar bien, martingalas y parada óptima. Para la segunda vuelta de entrevistas.',
      secciones:[
        {titulo:'Caja de herramientas para resolver problemas',lecciones:[
          L('variables-indicadoras','Linealidad y variables indicadoras',12,'Sumar esperanzas no pide permiso: con ceros y unos, los recuentos difíciles se vuelven sumas de probabilidades.','leccion-variables-indicadoras.html'),
          L('condicionamiento-estrategico','Condicionamiento estratégico',11,'Elegir por qué condicionar es la mitad del problema: primer paso, último paso o el suceso que lo simplifica todo.')
        ]},
        {titulo:'Modelos avanzados de probabilidad',lecciones:[
          L('martingalas-y-juegos-justos','Martingalas y juegos justos',12,'Si el juego es justo, la esperanza no se mueve: la idea que resuelve tiempos de espera sin ecuaciones.'),
          L('ruina-del-jugador','Ruina del jugador y tiempos de llegada',12,'La probabilidad de arruinarte antes de llegar a tu meta y cuánto tardas, con y sin ventaja.'),
          L('parada-optima','Parada óptima: cuándo plantarse',12,'Parar o seguir: el valor de la opción de volver a tirar y el problema del secretario.')
        ]}
      ]
    },
    {
      id:'mercados',
      titulo:'Introducción a los mercados, el trading y el riesgo',
      nivel:'básico',
      descripcion:'Cómo funciona un libro de órdenes, por qué existe un market maker y cómo decide sus precios, gestiona su inventario y mide su resultado. Lo que se da por sabido en una entrevista de trading.',
      secciones:[
        {titulo:'Microestructura del mercado',lecciones:[
          L('como-funciona-un-libro-de-ordenes','Cómo funciona un libro de órdenes',11,'Órdenes límite, órdenes a mercado y la cola de prioridad precio-tiempo, paso a paso.'),
          L('horquilla-profundidad-y-liquidez','Horquilla, profundidad y liquidez',11,'Qué dice la diferencia entre compra y venta (bid-ask spread) y cuánto cuesta mover tamaño.')
        ]},
        {titulo:'La lógica del market making',lecciones:[
          L('que-es-el-market-making','Qué es el market making y por qué importa',11,'Cotizar a los dos lados y cobrar la horquilla: el negocio y el riesgo que lleva dentro.'),
          L('como-elige-cotizaciones-un-market-maker','Cómo elige sus cotizaciones un market maker',11,'Valor justo, horquilla y tamaño: las tres decisiones de cada precio que publicas.'),
          L('riesgo-de-inventario','Riesgo de inventario y reversión a la media',11,'Acumular posición sin querer, y por qué el inventario tiende a volver a cero si lo gestionas.'),
          L('ratio-de-acierto-y-horquilla','Ratio de acierto frente a horquilla: el dilema central',11,'Más estrecho, más operaciones; más ancho, más margen. Dónde está el punto bueno.'),
          L('ensanchar-la-horquilla','Ensanchar la horquilla con incertidumbre y volatilidad',11,'Cuándo y cuánto abrir los precios cuando el mercado se mueve o faltan datos.'),
          L('hacer-mercado-en-opciones','Hacer mercado en opciones',12,'Cotizar volatilidad en vez de precio, y cubrir la delta para quedarte solo con lo que quieres.')
        ]},
        {titulo:'Entender el precio',lecciones:[
          L('que-es-el-valor-justo','Qué es el valor justo',11,'El precio al que no esperas ganar ni perder, y de dónde sale cuando no hay un mercado que lo diga.'),
          L('flujo-de-ordenes-y-precio-real','Usar el flujo de órdenes para estimar el precio real',12,'Si todo el mundo te compra, tu precio está bajo: aprender del flujo sin dejarse arrastrar.'),
          L('volatilidad-e-intervalos-de-confianza','Volatilidad e intervalos de confianza al poner precio',11,'Convertir una volatilidad en un rango razonable de precios y en el ancho de la horquilla.')
        ]},
        {titulo:'Mecánica y estrategia de cotización',lecciones:[
          L('cotizar-alrededor-del-valor-justo','Cotizar alrededor del valor justo',11,'Compra por debajo, vende por encima: cuánto separar cada lado y en qué cantidad.'),
          L('sesgar-las-cotizaciones','Sesgar las cotizaciones para gestionar el riesgo',11,'Si vas largo, baja los dos precios: el sesgo (skew) que te ayuda a soltar inventario.'),
          L('cotizacion-dinamica','Adaptarse al flujo: cotización dinámica',12,'Cambiar precios y tamaños conforme entran operaciones, sin perseguir al mercado.')
        ]},
        {titulo:'Ejecución y simulación',lecciones:[
          L('deslizamiento-latencia-y-seleccion-adversa','Deslizamiento, arbitraje de latencia y selección adversa',12,'Por qué el precio al que ejecutas no es el que viste, y quién gana cuando alguien sabe más que tú.')
        ]},
        {titulo:'Resultado y gestión del riesgo',lecciones:[
          L('pnl-realizado-y-mark-to-market','Resultado realizado frente a valorado a mercado',11,'Lo que ya has cobrado y lo que vale tu posición ahora: dos cifras que conviene no mezclar.'),
          L('coberturas-basicas-para-market-makers','Coberturas básicas para market makers',11,'Neutralizar el riesgo que no quieres con otro instrumento, y lo que cuesta hacerlo.'),
          L('valoracion-de-inventario-y-exposicion','Valoración del inventario y exposición',11,'Cuánto arriesgas de verdad con lo que tienes en cartera, y cómo resumirlo en un número.'),
          L('uso-de-capital-y-limites-de-riesgo','Uso de capital y límites de riesgo',11,'Límites por posición, por mesa y por día: cómo se reparte el capital y qué pasa al tocarlos.')
        ]},
        {titulo:'Datos',lecciones:[
          L('que-datos-usarias','¿Qué datos usarías?',11,'Una pregunta frecuente en entrevistas: qué datos pedirías para una estrategia y cómo los validarías.')
        ]}
      ]
    },
    {
      id:'activos',
      titulo:'Clases de activos y productos',
      nivel:'intermedio',
      descripcion:'Futuros, opciones, ETF, bonos, divisas y materias primas: qué es cada producto, cómo se valora y dónde está la ineficiencia que un trader busca.',
      secciones:[
        {titulo:'Futuros y forwards',lecciones:[
          L('introduccion-a-futuros-y-forwards','Introducción a los futuros y forwards',11,'Comprometerse hoy a un precio para mañana: qué son, en qué se diferencian y para qué sirven.'),
          L('coste-de-acarreo','Precio de los futuros y el coste de acarreo',12,'Por qué el futuro no vale lo mismo que el contado: tipos, dividendos y almacenamiento (cost of carry).'),
          L('contango-y-backwardation','Curva de futuros: contango y backwardation',11,'Leer la curva de vencimientos y entender qué cuenta cuando sube o cuando se invierte.')
        ]},
        {titulo:'Opciones',lecciones:[
          L('introduccion-a-las-opciones','Introducción a las opciones',11,'Derecho sin obligación: calls, puts, strike y vencimiento, con los pagos dibujados.'),
          L('diagramas-de-pago','Diagramas de pago: estrategias con opciones',12,'Combinar calls y puts para dibujar el pago que quieres: spreads, straddles y collares.'),
          L('las-griegas','Las griegas: sensibilidades',12,'Delta, gamma, vega y theta: cuánto cambia una opción cuando cambia cada cosa.'),
          L('black-scholes-y-volatilidad-implicita','El modelo de Black-Scholes y la volatilidad implícita',12,'La fórmula, lo que supone y por qué el mercado la usa al revés para cotizar volatilidad.'),
          L('arbol-binomial','El árbol binomial para valorar opciones',12,'Valorar una opción paso a paso con subidas y bajadas, y ver de dónde sale la cobertura.'),
          L('sonrisa-y-superficie-de-volatilidad','Sonrisa y superficie de volatilidad',11,'Por qué la volatilidad implícita cambia con el strike y el plazo, y qué dice eso del miedo del mercado.'),
          L('griegas-de-segundo-orden','Griegas de segundo orden y sus implicaciones',12,'Vanna, volga y charm: los efectos cruzados que importan cuando el libro es grande.'),
          L('cobertura-de-opciones','Cobertura (hedging) de opciones',12,'Cubrir la delta, convivir con la gamma y decidir cada cuánto reajustar.')
        ]},
        {titulo:'ETF',lecciones:[
          L('introduccion-a-los-etf','Introducción a los ETF',10,'Una cesta que cotiza como una acción: qué es un ETF y por qué los market makers viven de ellos.'),
          L('creacion-y-reembolso-de-etf','Creación y reembolso de participaciones',11,'El mecanismo que mantiene el precio del ETF pegado al de su cesta, y quién puede usarlo.'),
          L('precio-de-un-etf-e-ineficiencias','Precio de un ETF y cómo operar sus ineficiencias',12,'Valor liquidativo, prima y descuento: cuándo el ETF se separa de la cesta y cómo se aprovecha.'),
          L('cobertura-de-etf','Cobertura de ETF',11,'Cubrir una posición en un ETF con futuros, cestas o con otro ETF, y lo que se queda sin cubrir.')
        ]},
        {titulo:'Renta fija',lecciones:[
          L('introduccion-a-la-renta-fija','Introducción a los productos de renta fija',11,'Bonos, cupones y vencimientos: qué compras cuando prestas dinero y quién lo emite.'),
          L('valoracion-de-bonos','Fundamentos de la valoración de bonos',12,'Descontar cupones, entender la rentabilidad (yield) y por qué precio y tipo van al revés.'),
          L('riesgo-de-tipos-y-curva','Riesgo de tipos de interés y curva de tipos',12,'Duración, convexidad y qué cuenta la forma de la curva sobre lo que espera el mercado.')
        ]},
        {titulo:'Divisas (FX)',lecciones:[
          L('introduccion-al-mercado-de-divisas','Introducción al mercado de divisas',10,'El mercado más grande del mundo: quién opera, cuándo y a qué horas se mueve.'),
          L('pares-y-convenciones-de-cotizacion','Pares de divisas y convenciones de cotización',11,'Base, cotizada, pips y cruces: leer EUR/USD sin equivocarse de lado.'),
          L('carry-trade','Carry trade y diferenciales de tipos',11,'Pedir prestado barato y prestar caro en otra divisa, y el riesgo que se esconde en el tipo de cambio.')
        ]},
        {titulo:'Materias primas',lecciones:[
          L('introduccion-a-las-materias-primas','Introducción a las materias primas',10,'Energía, metales y agrícolas: qué las hace distintas de un activo financiero.'),
          L('spot-y-futuros-en-materias-primas','Contado frente a futuros en materias primas',11,'Almacenar, transportar y entregar: por qué aquí el coste de acarreo es físico.'),
          L('principales-mercados-de-materias-primas','Principales mercados e instrumentos de materias primas',11,'Dónde cotizan el crudo, el oro o el trigo, y los contratos que mueven cada mercado.')
        ]}
      ]
    },
    {
      id:'juegos',
      titulo:'Teoría de juegos y trading estratégico',
      nivel:'intermedio',
      descripcion:'Jugar contra alguien que también piensa: equilibrio, apuestas con ventaja incierta, el criterio de Kelly y cómo leer a la contraparte. Es la teoría detrás de los juegos de las entrevistas.',
      secciones:[
        {titulo:'Pensamiento estratégico',lecciones:[
          L('que-es-un-juego-estrategico','Qué es un juego estratégico',10,'Jugadores, estrategias y pagos: cómo escribir un problema para poder razonar sobre él.'),
          L('juegos-de-suma-cero-y-minimax','Juegos de suma cero y minimax',11,'Lo que gano lo pierdes tú: elegir la jugada que mejor resiste al peor rival.'),
          L('dominancia-y-eliminacion-iterada','Dominancia y eliminación iterada',11,'Quitar las jugadas que nadie racional haría, una ronda tras otra, hasta que queda la respuesta.')
        ]},
        {titulo:'Aleatorizar y equilibrio',lecciones:[
          L('equilibrio-en-estrategias-mixtas','Equilibrio en estrategias mixtas',12,'Cuando no hay jugada pura buena, hay que sortear: cómo calcular las probabilidades del equilibrio.'),
          L('juego-de-apuestas-as-reina','El juego de apuestas as-reina',12,'Un juego de farol con dos cartas que enseña a mezclar estrategias y a no ser predecible.')
        ]},
        {titulo:'Apuestas, tamaño y crecimiento',lecciones:[
          L('valor-esperado-contra-un-optimizador','Valor esperado contra un optimizador',11,'Tu esperanza cambia si el rival elige en tu contra: cómo valorar un juego cuando el otro también piensa.'),
          L('criterio-de-kelly','El criterio de Kelly',12,'Cuánto apostar cuando tienes ventaja: la fracción que maximiza el crecimiento sin arruinarte.'),
          L('tamano-de-apuesta-con-ventaja-incierta','Tamaño de apuesta con ventaja incierta',11,'Si no sabes bien tu ventaja, apuesta menos: Kelly fraccionario y por qué pasarse cuesta más que quedarse corto.'),
          L('subastas-y-mecanismos','Subastas y mecanismos básicos',11,'Primer precio, segundo precio y sobre cerrado: cuánto pujar en cada una y por qué.')
        ]},
        {titulo:'Juegos en la entrevista',lecciones:[
          L('hazme-un-mercado-como-juego','Hazme un mercado visto como un juego',12,'El juego de cotizar de las entrevistas, analizado: qué sabe cada uno, qué quiere y dónde está tu ventaja.'),
          L('jugar-a-un-juego-desconocido','Jugar a un juego que no conoces',11,'Qué preguntar, qué probar primero y cómo sacar la estrategia cuando te presentan un juego nuevo.')
        ]},
        {titulo:'Información y selección adversa',lecciones:[
          L('maldicion-del-ganador','La maldición del ganador',11,'Si ganas la subasta, probablemente pagaste de más: cómo corregir tu puja por lo que implica ganar.'),
          L('seleccion-adversa-y-horquilla','Selección adversa y la horquilla',11,'Quien opera contigo puede saber más: por qué la horquilla es el precio de esa desventaja.'),
          L('leer-a-la-contraparte','Leer a la contraparte',11,'Qué revela cada operación sobre lo que sabe el otro, y cómo cambiar tu precio con ello.')
        ]}
      ]
    },
    {
      id:'finanzas',
      titulo:'Bases de finanzas cuantitativas',
      nivel:'intermedio',
      descripcion:'Las ideas matemáticas que sostienen los precios: no hay arbitraje, replicar un pago, paseos aleatorios y el cálculo justo para seguir una demostración.',
      secciones:[
        {titulo:'Precio y lógica de arbitraje',lecciones:[
          L('paridad-put-call','Paridad put-call y posiciones sintéticas',11,'Una call, una put y el subyacente están atados por una ecuación: úsala para fabricar lo que no cotiza.'),
          L('ley-del-precio-unico','Ley del precio único y replicación',11,'Dos carteras con el mismo pago valen lo mismo, o alguien se hace rico: la base de toda valoración.')
        ]},
        {titulo:'Procesos aleatorios',lecciones:[
          L('paseos-aleatorios-y-movimiento-browniano','Paseos aleatorios y movimiento browniano',12,'Del paso a paso con monedas al límite continuo: por qué la incertidumbre crece con la raíz del tiempo.')
        ]},
        {titulo:'Herramientas matemáticas',lecciones:[
          L('calculo-para-quants','Cálculo para quants',12,'Derivadas, integrales y desarrollos de Taylor, solo los que hacen falta para las griegas y las demostraciones.')
        ]}
      ]
    },
    {
      id:'programacion',
      titulo:'Programación para quant developers',
      nivel:'intermedio',
      descripcion:'Python como lo escribe un quant developer: vectorizado, sin fugas de futuro y con un registro de operaciones que aguanta una revisión de código.',
      secciones:[
        {titulo:'Python quant que sobrevive a una revisión',lecciones:[
          L('vectorizar-sin-perder-el-hilo','Vectorizar sin perder el hilo',12,'Sustituir bucles por NumPy y pandas sin que el código deje de entenderse.'),
          L('series-temporales-y-sesgo-de-anticipacion','Alinear series temporales y el sesgo de anticipación',12,'Juntar datos de distintas fuentes sin usar sin querer información del futuro (lookahead).'),
          L('un-registro-de-operaciones','Un registro de operaciones (trade blotter), de principio a fin',12,'Leer, validar y agregar operaciones hasta el resultado por símbolo, con tests.')
        ]}
      ]
    },
    {
      id:'matematicas',
      titulo:'Matemáticas rápidas para entrevistas',
      nivel:'básico',
      descripcion:'Las matemáticas que se hacen de cabeza y contra el reloj: aritmética rápida, aproximaciones y los sistemas pequeños que aparecen en las rondas de acertijos.',
      secciones:[
        {titulo:'Velocidad',lecciones:[
          L('calculo-mental-y-velocidad-de-reaccion','El papel del cálculo mental y la velocidad de reacción',10,'Por qué las firmas miden velocidad, qué miden de verdad y cómo entrenarla sin quemarse.')
        ]},
        {titulo:'Aproximar y resolver',lecciones:[
          L('aproximar-raices-logaritmos-y-potencias','Aproximar raíces, logaritmos y potencias',11,'Raíz de 50, log de 3 o 1,07 elevado a 10, con un error que puedas controlar y sin calculadora.'),
          L('sistemas-lineales-y-optimizacion','Sistemas lineales y optimización en rondas de acertijos',12,'Plantear dos o tres incógnitas, resolver de cabeza y reconocer cuándo un acertijo es un problema de optimización.')
        ]}
      ]
    }
  ];

  /* =========================================================================
     RUTAS
     Un elemento: {tipo, ref, titulo, min, meta, href}. Los de tipo 'leccion'
     se rellenan desde el curso al cargar (título, minutos, href, resumen).
     Los de tipo 'curso' llevan ref:{curso, lecciones:[slugs]} y sus minutos
     son la suma. `extra:true` marca lo que es nuestro y no está en la
     estructura de referencia.
     ========================================================================= */
  var FUND_PROB=['reglas-de-probabilidad','valor-esperado','varianza-y-desviacion-tipica','metodos-de-conteo','tecnicas-avanzadas-de-conteo',
    'probabilidad-condicionada','teorema-de-bayes','bernoulli-y-binomial','poisson-y-geometrica','uniforme-y-normal','teorema-central-del-limite',
    'probabilidad-geometrica','estadisticos-de-orden','binomial-negativa-e-hipergeometrica','cadenas-de-markov'];
  var FUND_INFER=['intervalos-de-confianza','contraste-de-hipotesis','p-valores','errores-de-tipo-i-y-ii','significacion-estadistica-y-practica',
    'herramientas-frecuentistas-avanzadas','minimos-cuadrados-ordinarios'];
  var AVANZ_TODO=['variables-indicadoras','condicionamiento-estrategico','martingalas-y-juegos-justos','ruina-del-jugador','parada-optima'];
  var MERC_BASE=['como-funciona-un-libro-de-ordenes','horquilla-profundidad-y-liquidez','que-es-el-market-making','como-elige-cotizaciones-un-market-maker',
    'riesgo-de-inventario','ratio-de-acierto-y-horquilla','que-es-el-valor-justo','cotizar-alrededor-del-valor-justo','deslizamiento-latencia-y-seleccion-adversa'];
  var MERC_MM=['ensanchar-la-horquilla','hacer-mercado-en-opciones','sesgar-las-cotizaciones','cotizacion-dinamica','flujo-de-ordenes-y-precio-real',
    'volatilidad-e-intervalos-de-confianza','pnl-realizado-y-mark-to-market','coberturas-basicas-para-market-makers','valoracion-de-inventario-y-exposicion','uso-de-capital-y-limites-de-riesgo'];
  var ACT_FUT_OPC_ETF=['introduccion-a-futuros-y-forwards','coste-de-acarreo','contango-y-backwardation','introduccion-a-las-opciones','diagramas-de-pago','las-griegas',
    'black-scholes-y-volatilidad-implicita','arbol-binomial','sonrisa-y-superficie-de-volatilidad','griegas-de-segundo-orden','cobertura-de-opciones',
    'introduccion-a-los-etf','creacion-y-reembolso-de-etf','precio-de-un-etf-e-ineficiencias','cobertura-de-etf'];
  var ACT_RF_FX_MP=['introduccion-a-la-renta-fija','valoracion-de-bonos','riesgo-de-tipos-y-curva','introduccion-al-mercado-de-divisas','pares-y-convenciones-de-cotizacion',
    'carry-trade','introduccion-a-las-materias-primas','spot-y-futuros-en-materias-primas','principales-mercados-de-materias-primas'];
  var JUEGOS_TODO=['que-es-un-juego-estrategico','juegos-de-suma-cero-y-minimax','dominancia-y-eliminacion-iterada','equilibrio-en-estrategias-mixtas','juego-de-apuestas-as-reina',
    'valor-esperado-contra-un-optimizador','criterio-de-kelly','tamano-de-apuesta-con-ventaja-incierta','subastas-y-mecanismos','hazme-un-mercado-como-juego',
    'jugar-a-un-juego-desconocido','maldicion-del-ganador','seleccion-adversa-y-horquilla','leer-a-la-contraparte'];
  var PROG_TODO=['vectorizar-sin-perder-el-hilo','series-temporales-y-sesgo-de-anticipacion','un-registro-de-operaciones'];

  var rutas={
    trader:{
      id:'trader',
      titulo:'Ruta Trader',
      descripcion:'Todo lo que pide una selección de quant trader, en el orden en que te lo van a pedir: velocidad, probabilidad, acertijos, mercados, hacer precios, juegos y las pruebas de cada firma.',
      ritmo:'De 4 a 6 semanas a 1 hora al día',
      hito:'Listo para la entrevista',
      secciones:[
        {
          n:1,titulo:'Velocidad en la prueba online',
          descripcion:'La primera criba es una prueba de cálculo contra el reloj. Aquí aprendes a qué vas y empiezas a medir tu velocidad.',
          preparaPara:['pruebas-online'],
          items:[
            it('articulo','que-hace-un-quant-trader','¿Qué hace realmente un quant trader?',5,'',  'guia-que-hace-un-quant-trader.html',{extra:true}),
            it('video','que-hace-un-quant-trader','Qué hace un quant trader, en vídeo',5,'','video-que-hace-un-quant-trader.html',{extra:true}),
            it('articulo','calculo-mental-pruebas','Cálculo mental: cómo ser más rápido y más preciso',8,''),
            it('articulo','series-numericas-patrones','Series numéricas: cómo reconocer el patrón',8,''),
            le('calculo-mental-y-velocidad-de-reaccion'),
            it('entrenador','calculo-mental','Entrenador de cálculo',10,'20 cuentas bien en 60 s','entrenador-calculo-mental.html',{done:'hist:calculo'}),
            it('entrenador','series-numericas','Entrenador de series',10,'70 % en menos de 30 s'),
            it('entrenador','fracciones-y-decimales','Entrenador de fracciones y decimales',10,'70 % en menos de 20 s')
          ]
        },
        {
          n:2,titulo:'Probabilidad y valor esperado',
          descripcion:'El idioma de las entrevistas. Casi toda pregunta técnica acaba en cuánto vale una apuesta y con qué riesgo.',
          preparaPara:['pruebas-online','entrevistas-tecnicas'],
          items:[
            cu('fundamentos',FUND_PROB,'Fundamentos de probabilidad y estadística: bloques 1 a 7','Las reglas, el conteo, las distribuciones y las cadenas de Markov.'),
            it('pregunta','juego-del-dado','El juego del dado',10,'','pregunta-juego-del-dado.html',{extra:true}),
            cu('avanzados',AVANZ_TODO,'Temas avanzados de probabilidad y estadística','Indicadoras, condicionar bien, martingalas, ruina y parada óptima.'),
            le('paseos-aleatorios-y-movimiento-browniano'),
            it('entrenador','probabilidad','Entrenador de probabilidad',10,'70 % en menos de 25 s')
          ]
        },
        {
          n:3,titulo:'Acertijos y matemáticas',
          descripcion:'Los problemas de ingenio de las entrevistas: no se memorizan, se aprende el truco que hay detrás de cada familia.',
          preparaPara:['pruebas-online','entrevistas-tecnicas'],
          items:[
            cu('avanzados',['variables-indicadoras','condicionamiento-estrategico'],'Temas avanzados: caja de herramientas','Las dos lecciones que resuelven la mayoría de acertijos de esperanza.'),
            le('aproximar-raices-logaritmos-y-potencias'),
            le('sistemas-lineales-y-optimizacion'),
            it('preguntas','acertijos-matematicos-del-curso','Preguntas del curso: acertijos matemáticos',9,'75 % de aciertos'),
            it('preguntas','acertijos-esenciales','Acertijos esenciales',40,'Resuelve 10'),
            it('preguntas','acertijos-de-cartas-y-monedas','Acertijos de cartas y monedas',32,'Resuelve 8'),
            it('preguntas','los-50-acertijos','Los 50 acertijos más preguntados',60,'Resuelve 15'),
            it('preguntas','acertijos-de-razonamiento','Acertijos de razonamiento',180,'Resuelve 44')
          ]
        },
        {
          n:4,titulo:'Mercados y productos',
          descripcion:'Cómo funciona un mercado, qué hace un market maker y qué son los productos que vas a cotizar: futuros, opciones y ETF.',
          preparaPara:['entrevistas-tecnicas','ronda-final'],
          items:[
            cu('mercados',MERC_BASE,'Introducción a los mercados: del libro de órdenes al valor justo','Microestructura, la lógica del market making, el precio y la ejecución.'),
            cu('activos',ACT_FUT_OPC_ETF,'Clases de activos: futuros, opciones y ETF','Los tres productos que más salen en las entrevistas de trading.'),
            cu('finanzas',['paridad-put-call','ley-del-precio-unico'],'Bases de finanzas cuantitativas: precio y arbitraje','Paridad put-call y la ley del precio único.'),
            it('preguntas','matematicas-financieras-del-curso','Preguntas del curso: matemáticas financieras',12,'75 % de aciertos'),
            it('preguntas','teoria-de-opciones','Preguntas de teoría de opciones',56,'Resuelve 14'),
            it('entrenador','market-making-de-etf','Market making de ETF',10,'70 % de aciertos'),
            it('entrenador','market-making-de-opciones','Market making de opciones',10,'70 % de aciertos'),
            it('entrenador','futuros-y-base','Futuros y base',10,'70 % de aciertos'),
            it('entrenador','mercados-de-prediccion','Mercados de predicción',10,'70 % de aciertos')
          ]
        },
        {
          n:5,titulo:'Hacer mercados',
          descripcion:'Poner un precio de compra y otro de venta, ajustarlos cuando alguien opera contigo y no perder la cuenta de lo que tienes.',
          preparaPara:['entrevistas-tecnicas','ronda-final'],
          items:[
            it('articulo','hazme-un-mercado','Hazme un mercado: cómo responder',6,''),
            cu('mercados',MERC_MM,'Introducción a los mercados: cotizar, cubrir y medir el resultado','Horquilla, sesgo, flujo, coberturas y límites de riesgo.'),
            it('juego','hazme-un-mercado','Hazme un mercado con dados',15,'Acaba en beneficio','juego-hazme-un-mercado.html'),
            it('juego','arbitraje-de-etf','Arbitraje de ETF',15,'Acaba en beneficio'),
            it('juego','contratos-sobre-eventos','Contratos sobre eventos',15,'Consigue 50 puntos'),
            it('juego','trading','Juego de trading',15,'Acaba en beneficio')
          ]
        },
        {
          n:6,titulo:'Juegos de apuestas y estimación',
          descripcion:'Jugar contra alguien que también piensa, decidir cuánto apostar y dar un número razonable con pocos datos.',
          preparaPara:['entrevistas-tecnicas','ronda-final'],
          items:[
            cu('juegos',JUEGOS_TODO,'Teoría de juegos y trading estratégico','Equilibrio, Kelly, subastas y selección adversa.'),
            it('juego','cartas','Juego de cartas',15,'Acaba en beneficio'),
            it('juego','estimacion-de-fermi','Juego de estimación de Fermi',15,'50 puntos por ronda'),
            it('entrenador','preguntas-de-fermi','Preguntas de Fermi',10,'Media de 60 puntos','estimacion-cafe-en-madrid.html',{done:'pregunta:cafe-en-madrid',nota:'Empieza por los cafés en Madrid.'})
          ]
        },
        {
          n:7,titulo:'Juegos cognitivos',
          descripcion:'Algunas firmas miden atención, memoria y cambio de tarea con juegos cortos. Se entrenan, igual que el cálculo.',
          preparaPara:['pruebas-online'],
          items:[
            it('entrenador','cambio-de-tarea','Cambio de tarea',10,'Supera tu marca'),
            it('entrenador','conflicto-de-respuesta','Conflicto de respuesta',10,'Supera tu marca'),
            it('entrenador','codigo-pin','Juego del código PIN',10,'Supera tu marca')
          ]
        },
        {
          n:8,titulo:'Pruebas de las firmas',
          descripcion:'Cada firma tiene su prueba online. Aquí solo imitamos el formato público de cada una, nunca el contenido real.',
          preparaPara:['solicitud','pruebas-online','entrevista-rrhh','oferta'],
          items:[
            prueba('Flow Traders','flow-traders-calculo','Prueba de cálculo',10,{nota:'El formato cambia por región según fuentes públicas no oficiales.'}),
            prueba('Flow Traders','flow-traders-series','Prueba de series',10),
            prueba('Maven','maven-calculo','Prueba de cálculo',10),
            prueba('Maven','maven-series','Prueba de series',10),
            prueba('Maven','maven-intervalos-de-confianza','Intervalos de confianza',15),
            prueba('Akuna','akuna-calculo','Prueba de cálculo',10),
            prueba('Akuna','akuna-series','Series',10),
            prueba('Akuna','akuna-juego-de-cuadricula','Juego de la cuadrícula (VidCruiter)',15),
            prueba('Da Vinci','da-vinci-cuestionario-numerico','Cuestionario numérico',15),
            prueba('SIG','sig-evaluacion-cuantitativa','Evaluación cuantitativa',30),
            prueba('SIG','sig-resolucion-de-problemas','Prueba de resolución de problemas',30),
            prueba('Citadel','citadel-prueba-de-trading','Prueba de trading',30),
            prueba('Mako','mako-aptitud','Aptitud',20),
            prueba('Mako','mako-codility','Codility',60),
            prueba('DRW','drw-prueba-online','Prueba online (OA)',45),
            prueba('CTC','ctc-aptitud-cognitiva','Aptitud cognitiva',20),
            prueba('Optiver','optiver-calculo-80-en-8','Prueba de cálculo (80 en 8)',10,{href:'simulacro-calculo.html',done:'simulacro:calculo',extra:true,nota:'Formato de 80 preguntas en 8 minutos según fuentes públicas no oficiales (ver fuentes).'}),
            it('articulo','proceso-de-seleccion','Las entrevistas de quant trading, de principio a fin',12,''),
            it('preguntas','preguntas-de-comportamiento','Preguntas de comportamiento (behavioral)',20,'Para leer a la vez')
          ]
        },
        {
          n:9,titulo:'Datos y código',opcional:true,
          descripcion:'Para las firmas que también piden programar o razonar con datos: inferencia, regresión, Python de calidad y problemas de código.',
          preparaPara:['pruebas-online','entrevistas-tecnicas'],
          items:[
            le('que-datos-usarias'),
            cu('fundamentos',FUND_INFER,'Fundamentos de probabilidad y estadística: inferencia y regresión','Intervalos, contrastes, p-valores y mínimos cuadrados.'),
            cu('programacion',PROG_TODO,'Programación para quant developers','Python vectorizado, series temporales sin sesgo y un registro de operaciones.'),
            it('codigo','libro-de-ordenes','Libro de órdenes: mejor precio',30,'','codigo-libro-de-ordenes.html',{extra:true}),
            it('codigo','pnl-de-un-registro-de-operaciones','Resultado a partir de un registro de operaciones',25,''),
            it('codigo','subarrays-con-suma-objetivo','Subarrays que suman un objetivo',20,''),
            it('codigo','simbolos-mas-negociados-por-dia-sql','Símbolos más negociados por día, en SQL',20,''),
            it('codigo','cola-con-buffer-circular','Cola con buffer circular',20,''),
            it('codigo','subarray-de-suma-maxima','Subarray de suma máxima y variantes',25,''),
            it('codigo','analizador-de-terminos-de-trading','Analizador de términos de trading',25,''),
            it('codigo','alcanzar-un-total','Alcanzar un total',20,'')
          ]
        },
        {
          n:10,titulo:'Tipos, divisas y materias primas',opcional:true,
          descripcion:'Los productos que no salen en la primera entrevista pero sí en la mesa: bonos, divisas y materias primas.',
          preparaPara:['entrevistas-tecnicas'],
          items:[
            cu('activos',ACT_RF_FX_MP,'Clases de activos: renta fija, divisas y materias primas','Bonos y curva de tipos, pares de divisas y carry, contado y futuros físicos.')
          ]
        },
        {
          n:11,titulo:'Cálculo',opcional:true,
          descripcion:'El cálculo mínimo para seguir una demostración de griegas o de Black-Scholes.',
          preparaPara:['entrevistas-tecnicas'],
          items:[
            le('calculo-para-quants')
          ]
        }
      ]
    },
    researcher:{id:'researcher',titulo:'Ruta Researcher',proximamente:true,secciones:[]},
    developer:{id:'developer',titulo:'Ruta Developer',proximamente:true,secciones:[]}
  };

  /* =========================================================================
     ETAPAS DEL PROCESO DE SELECCIÓN (genéricas; cada firma varía)
     preparadoPor: números de sección de la ruta de trader
     ========================================================================= */
  var etapas=[
    {
      id:'solicitud',titulo:'Solicitud',
      descripcion:'Envías CV y formulario en la web de la firma. Suelen pedir expediente, nota media y una carta corta. Aquí se decide quién pasa a las pruebas online, así que el CV tiene que ser concreto y corto.',
      rondas:[
        {titulo:'CV y formulario',descripcion:'Un CV de una página, con resultados y no con tareas, y las respuestas del formulario preparadas antes de entrar.',preparadoPor:[8]}
      ]
    },
    {
      id:'pruebas-online',titulo:'Pruebas online',
      descripcion:'Pruebas automáticas, cronometradas y sin calculadora. Cada firma usa las suyas, pero casi todas empiezan por cálculo mental y series. Es la criba más grande del proceso.',
      rondas:[
        {titulo:'Cálculo mental',descripcion:'Operaciones con enteros, decimales y fracciones a pocos segundos por pregunta. Suele penalizar el fallo.',preparadoPor:[1,8]},
        {titulo:'Series y patrones',descripcion:'Completar la sucesión numérica o de figuras. Vale más reconocer la familia del patrón que probar al azar.',preparadoPor:[1,8]},
        {titulo:'Probabilidad y lógica',descripcion:'Preguntas cortas de probabilidad, valor esperado y razonamiento, con tiempo por pregunta.',preparadoPor:[2,3]},
        {titulo:'Juegos cognitivos y pruebas de aptitud',descripcion:'Atención, memoria, cambio de tarea y razonamiento abstracto en juegos de pocos minutos.',preparadoPor:[7,8]},
        {titulo:'Programación',descripcion:'Solo en algunas firmas y en los puestos mixtos: problemas de código en una plataforma online.',preparadoPor:[9]}
      ]
    },
    {
      id:'entrevista-rrhh',titulo:'Entrevista de RR. HH.',
      descripcion:'Una llamada corta con alguien de selección: motivación, disponibilidad, visado y las preguntas de comportamiento de siempre. No es técnica, pero elimina.',
      rondas:[
        {titulo:'Llamada con selección',descripcion:'Por qué trading, por qué esa firma, qué has hecho antes y cuándo podrías empezar. Respuestas claras y de un minuto.',preparadoPor:[8]}
      ]
    },
    {
      id:'entrevistas-tecnicas',titulo:'Entrevistas técnicas',
      descripcion:'Una o varias entrevistas con traders. Preguntan probabilidad, acertijos, mercados y te ponen a cotizar en voz alta. Buscan cómo razonas, no solo el número final.',
      rondas:[
        {titulo:'Probabilidad y valor esperado',descripcion:'Dados, cartas, monedas y juegos con decisiones. Hay que calcular y explicar a la vez.',preparadoPor:[2]},
        {titulo:'Acertijos y matemáticas',descripcion:'Problemas de ingenio y aproximaciones de cabeza, con el entrevistador apretando el tiempo.',preparadoPor:[3]},
        {titulo:'Mercados y productos',descripcion:'Qué es un market maker, cómo funciona un libro, qué pasa con una opción si sube la volatilidad.',preparadoPor:[4]},
        {titulo:'Hazme un mercado',descripcion:'Te piden un precio de compra y otro de venta sobre algo incierto, operan contigo y miran cómo ajustas.',preparadoPor:[5]},
        {titulo:'Juegos de apuestas',descripcion:'Un juego con reglas nuevas: tienes que encontrar la estrategia y decidir cuánto apostar.',preparadoPor:[6]},
        {titulo:'Estimación',descripcion:'Un número razonable con pocos datos, descompuesto en pasos que puedas defender.',preparadoPor:[6]},
        {titulo:'Código',descripcion:'Solo en algunas firmas: un problema pequeño en pantalla compartida, con énfasis en la claridad.',preparadoPor:[9]}
      ]
    },
    {
      id:'ronda-final',titulo:'Ronda final',
      descripcion:'Un día en la oficina o varias entrevistas seguidas con traders senior. Más juegos de mercado, a veces en grupo, y una conversación larga sobre cómo piensas.',
      rondas:[
        {titulo:'Juegos de mercado en grupo',descripcion:'Varios candidatos cotizando a la vez sobre el mismo activo. Importa el resultado y cómo gestionas el riesgo.',preparadoPor:[5,6]},
        {titulo:'Caso o problema largo',descripcion:'Un problema abierto de mercado o de producto que se trabaja durante un rato, con preguntas por el camino.',preparadoPor:[4,5]},
        {titulo:'Entrevista con traders senior',descripcion:'Lo mismo que las técnicas, más profundo y con menos pistas.',preparadoPor:[4,5,6]},
        {titulo:'Encaje y motivación',descripcion:'Cómo encajas en la mesa, cómo reaccionas al error y qué esperas del puesto.',preparadoPor:[8]}
      ]
    },
    {
      id:'oferta',titulo:'Oferta',
      descripcion:'Si todo encaja, llega la oferta: fecha de inicio, ciudad, salario fijo y variable. Conviene saber de antemano qué es normal en el sector y qué se puede negociar.',
      rondas:[
        {titulo:'Oferta y decisión',descripcion:'Leer bien las condiciones, preguntar lo que no esté claro y responder en el plazo que te den.',preparadoPor:[8]}
      ]
    }
  ];

  /* Fuentes consultadas para los formatos públicos de pruebas. Ninguna es
     oficial de la firma: son sitios de preparación. Por eso el catálogo no
     afirma cifras salvo en el elemento de Optiver, y lo dice. */
  var fuentes=[
    {titulo:'quantt.co.uk: Optiver 80 in 8 (práctica y formato)',url:'https://www.quantt.co.uk/tools/optiver-80-in-8',nota:'Sitio de preparación, no oficial. Describe 80 preguntas en 8 minutos con penalización por fallo.'},
    {titulo:'quantvault.org: Optiver 80 in 8',url:'https://quantvault.org/optiver-80-in-8.html',nota:'Sitio de preparación, no oficial. Misma descripción: 80 preguntas, 8 minutos, cuatro opciones.'},
    {titulo:'tradinginterview.com: Flow Traders online assessment',url:'https://www.tradinginterview.com/flow-traders-online-assessment/',nota:'Sitio de preparación. Indica que el formato de la prueba de cálculo de Flow Traders cambia por región y ciclo.'},
    {titulo:'prachub.com: Flow Traders OA',url:'https://prachub.com/resources/flow-traders-quant-trading-oa-2027-mental-math-sequences-speed-and-cutoffs',nota:'Sitio de preparación, no oficial. Recoge varios formatos distintos (60 en 6, 80 en 8, 75 en 10).'}
  ];

  var avisoPruebas='Esto no es la prueba real: imita el formato público y nada más.';

  /* =========================================================================
     ÍNDICES Y RELLENO (una vez, al cargar)
     ========================================================================= */
  var porId={},porSlug={};
  cursos.forEach(function(c){
    porId[c.id]=c;var n=0,min=0;
    c.secciones.forEach(function(s,si){
      s.n=si+1;
      s.lecciones.forEach(function(l){
        n++;min+=l.min;l.n=n;l.curso=c.id;l.seccion=s.titulo;l.seccionN=s.n;
        l.done='leccion:'+l.slug;
        if(!porSlug[l.slug])porSlug[l.slug]=l;
      });
    });
    c.nLecciones=n;c.min=min;c.href='curso.html?c='+c.id;c.done='curso:'+c.id;
  });

  var PREFIJO={leccion:'leccion',articulo:'guia',video:'video',entrenador:'entrenador',juego:'juego',pregunta:'pregunta',preguntas:'preguntas',prueba:'prueba',codigo:'codigo'};
  function doneId(item){
    if(item.done)return item.done;
    if(item.tipo==='curso')return 'curso:'+item.ref.curso;
    return (PREFIJO[item.tipo]||item.tipo)+':'+item.ref;
  }

  Object.keys(rutas).forEach(function(k){
    var r=rutas[k],total=0,totalOpc=0,nItems=0;
    (r.secciones||[]).forEach(function(s){
      var min=0;
      s.opcional=!!s.opcional;
      s.items.forEach(function(x,i){
        x.i=i+1;x.seccion=s.n;x.opcional=s.opcional;x.extra=!!x.extra;
        if(x.tipo==='leccion'){
          var l=porSlug[x.ref];
          if(l){x.titulo=x.titulo||l.titulo;x.min=x.min||l.min;x.href=x.href||l.href;x.resumen=x.resumen||l.resumen;x.curso=l.curso;}
        }else if(x.tipo==='curso'){
          var ls=x.ref.lecciones.map(function(sl){return porSlug[sl];}).filter(Boolean);
          x.min=ls.reduce(function(a,l){return a+l.min;},0);
          x.nLecciones=ls.length;
          x.href='curso.html?c='+x.ref.curso;
        }
        x.done=doneId(x);
        min+=x.min||0;
      });
      s.min=min;s.nItems=s.items.length;
      if(s.opcional)totalOpc+=min;else{total+=min;nItems+=s.items.length;}
    });
    r.min=total;r.minOpcionales=totalOpc;r.nItems=nItems;
  });

  /* =========================================================================
     AYUDAS PÚBLICAS
     ========================================================================= */
  function ruta(id){return rutas[id]||null;}
  function itemsRuta(id,conOpcionales){
    var r=ruta(id),out=[];if(!r)return out;
    r.secciones.forEach(function(s){if(conOpcionales===false&&s.opcional)return;s.items.forEach(function(x){out.push(x);});});
    return out;
  }
  function lecciones(item){
    if(!item)return [];
    if(item.tipo==='curso')return item.ref.lecciones.map(function(sl){return porSlug[sl];}).filter(Boolean);
    if(item.tipo==='leccion')return porSlug[item.ref]?[porSlug[item.ref]]:[];
    return [];
  }
  function isBuilt(item){
    if(!item)return false;
    if(item.tipo==='curso')return true;         /* curso.html?c=<id> existe para los 8 cursos */
    return !!item.href;
  }
  /* hecho: solo lee QM si está cargado; nunca escribe */
  function hechoId(id){
    var QM=root.QM;if(!QM||!id)return false;
    if(id.indexOf('hist:')===0)return (QM.history(id.slice(5))||[]).length>0;
    return QM.isDone(id);
  }
  function progreso(item){
    if(item&&item.tipo==='curso'){
      var ls=lecciones(item),h=ls.filter(function(l){return hechoId(l.done);}).length;
      return {hechos:h,total:ls.length};
    }
    return {hechos:hechoId(doneId(item))?1:0,total:1};
  }
  function isDone(item){var p=progreso(item);return p.total>0&&p.hechos===p.total;}
  function progresoCurso(id){
    var c=porId[id],h=0;if(!c)return {hechos:0,total:0};
    c.secciones.forEach(function(s){s.lecciones.forEach(function(l){if(hechoId(l.done))h++;});});
    return {hechos:h,total:c.nLecciones};
  }
  function fmt(m){m=Math.round(m||0);var h=Math.floor(m/60),r=m%60;return h?(h+' h'+(r?' '+r+' min':'')):(r+' min');}
  function seccionesEtapa(etapaId,rutaId){
    var r=ruta(rutaId||'trader');if(!r)return [];
    return r.secciones.filter(function(s){return (s.preparaPara||[]).indexOf(etapaId)>=0;});
  }
  function pruebasFirma(firma,rutaId){
    var f=String(firma||'').toLowerCase();
    return itemsRuta(rutaId||'trader').filter(function(x){return x.tipo==='prueba'&&String(x.firma||'').toLowerCase()===f;});
  }

  var CATALOGO={cursos:cursos,rutas:rutas,etapas:etapas,fuentes:fuentes,avisoPruebas:avisoPruebas};
  var CAT={
    cursos:cursos,rutas:rutas,etapas:etapas,
    tipos:{curso:'Curso',leccion:'Lección',articulo:'Guía',video:'Vídeo',entrenador:'Entrenador',juego:'Juego',pregunta:'Pregunta',preguntas:'Preguntas',prueba:'Prueba',codigo:'Código'},
    curso:function(id){return porId[id]||null;},
    leccion:function(slug){return porSlug[slug]||null;},
    etapa:function(id){for(var i=0;i<etapas.length;i++)if(etapas[i].id===id)return etapas[i];return null;},
    ruta:ruta,itemsRuta:itemsRuta,lecciones:lecciones,
    isBuilt:isBuilt,doneId:doneId,isDone:isDone,progreso:progreso,progresoCurso:progresoCurso,
    fmt:fmt,seccionesEtapa:seccionesEtapa,pruebasFirma:pruebasFirma
  };

  root.QM_CATALOGO=CATALOGO;
  root.QM_CAT=CAT;
  if(typeof module!=='undefined'&&module.exports)module.exports={QM_CATALOGO:CATALOGO,QM_CAT:CAT};
})(typeof window!=='undefined'?window:this);
