/* Contenido de Academia Web. Cada curso → módulos → unidades → clases. */
const COURSES = [
{ id: 'html', icon: '</>', title: 'HTML', desc: 'La estructura y el contenido de las páginas web.',
  soon: ['Módulo 2 · Textos, enlaces e imágenes', 'Módulo 3 · Listas, tablas y formularios', 'Módulo 4 · HTML semántico y accesibilidad'],
  modules: [{ title: 'Módulo 1 · Primeros pasos', units: [{ title: 'Unidad 1 · Tu primera página', lessons: [{
    id: 'html-1-1-1', title: 'Clase 1 · Etiquetas, títulos y párrafos',
    theory: `<p><b>HTML</b> (HyperText Markup Language) es el lenguaje con el que le decís al navegador <i>qué hay</i> en una página: títulos, párrafos, imágenes, enlaces. No calcula nada: <b>describe la estructura</b> del contenido.</p>
<p>Lo hace con <b>etiquetas</b>. Una etiqueta va entre <code>&lt;</code> y <code>&gt;</code>. Casi siempre vienen en pareja: una de <b>apertura</b> y una de <b>cierre</b> (con barra <code>/</code>). Lo que queda en el medio es el contenido.</p>
<pre><code>&lt;p&gt;Hola, mundo&lt;/p&gt;</code></pre>
<p>Las que vas a usar hoy:</p>
<ul><li><code>&lt;h1&gt;</code> a <code>&lt;h6&gt;</code>: títulos, del más al menos importante. Usá un solo <code>h1</code> por página.</li><li><code>&lt;p&gt;</code>: un párrafo de texto.</li><li><code>&lt;strong&gt;</code>: marca texto importante (el navegador lo muestra en negrita).</li></ul>`,
    example: { tabs: ['html'], code: { html: '<h1>Mi primera página</h1>\n<p>Hola, mundo. Este es mi <strong>primer</strong> párrafo.</p>' },
      explain: [['<h1>…</h1>', 'Título principal. Todo lo que está entre las dos etiquetas se muestra como título.'], ['<p>…</p>', 'Un párrafo. El navegador deja espacio antes y después.'], ['<strong>', 'Está <i>dentro</i> del párrafo: las etiquetas se pueden anidar, siempre cerrando primero la de adentro.']] },
    mistakes: ['Olvidar la etiqueta de cierre (<code>&lt;/p&gt;</code>): el navegador intenta adivinar dónde termina y el resultado puede cambiar.', 'Abrir con <code>&lt;h1&gt;</code> y cerrar con <code>&lt;/h2&gt;</code>: las etiquetas deben coincidir.', 'Elegir un título por su tamaño. Los títulos expresan jerarquía; el tamaño se cambia con CSS.'],
    exercises: [{ id: 'html-1-1-1-a', type: 'Completar código', title: 'Cerrá los párrafos', tabs: ['html'],
      prompt: 'A estos dos párrafos les falta la etiqueta de cierre. Completalos, ejecutá y comprobá.',
      start: { html: '<h1>Sobre mí</h1>\n<p>Estoy aprendiendo HTML.\n<p>Me encanta programar.' },
      hints: ['Cada <code>&lt;p&gt;</code> necesita su pareja de cierre.', 'La etiqueta de cierre lleva una barra: <code>&lt;/p&gt;</code>.', 'Escribí <code>&lt;/p&gt;</code> al final de cada línea de párrafo.'],
      checks: [{ n: 'Hay dos párrafos', t: "doc.querySelectorAll('p').length===2", m: '<b>Qué pasó:</b> no hay exactamente dos párrafos. <b>Por qué:</b> cada <code>&lt;p&gt;</code> crea un párrafo. <b>Solución:</b> dejá solo los dos párrafos originales.' },
        { n: 'Cada párrafo tiene su etiqueta de cierre', t: "(code.html.match(/<\\/p>/g)||[]).length===2", m: '<b>Qué pasó:</b> faltan etiquetas <code>&lt;/p&gt;</code>. <b>Por qué:</b> sin cierre el navegador adivina dónde termina el párrafo, y puede equivocarse. <b>Solución:</b> cerrá cada párrafo con <code>&lt;/p&gt;</code>.' }] }],
    challenge: { id: 'html-1-1-1-c', type: 'Escribir código desde cero', title: 'Tu mini presentación', tabs: ['html'],
      prompt: 'Escribí una presentación personal con un <code>&lt;h1&gt;</code> con tu nombre, al menos <b>dos párrafos</b> y al menos una palabra dentro de <code>&lt;strong&gt;</code>.',
      start: { html: '<!-- Escribí tu código acá -->\n' },
      hints: ['Empezá por el título: <code>&lt;h1&gt;Tu nombre&lt;/h1&gt;</code>.', 'Cada párrafo va en su propio <code>&lt;p&gt;…&lt;/p&gt;</code>.', 'Poné <code>&lt;strong&gt;</code> dentro de un párrafo, rodeando una palabra.'],
      checks: [{ n: 'Hay un título h1 con texto', t: "(doc.querySelector('h1')?.textContent.trim().length||0)>0", m: '<b>Qué pasó:</b> no encontré un <code>h1</code> con texto. <b>Por qué:</b> el título principal se escribe con <code>&lt;h1&gt;</code>. <b>Solución:</b> <code>&lt;h1&gt;Tu nombre&lt;/h1&gt;</code>.' },
        { n: 'Hay al menos dos párrafos', t: "doc.querySelectorAll('p').length>=2", m: '<b>Qué pasó:</b> hay menos de dos <code>&lt;p&gt;</code>. <b>Por qué:</b> cada párrafo necesita su propia etiqueta. <b>Solución:</b> agregá otro <code>&lt;p&gt;…&lt;/p&gt;</code>.' },
        { n: 'Hay texto en strong', t: "!!doc.querySelector('strong')", m: '<b>Qué pasó:</b> no uso <code>&lt;strong&gt;</code>. <b>Por qué:</b> es la etiqueta que marca texto importante. <b>Solución:</b> rodeá una palabra: <code>&lt;strong&gt;palabra&lt;/strong&gt;</code>.' }] },
    quiz: [{ q: '¿Qué etiqueta representa el título principal de una página?', o: ['<p>', '<h1>', '<strong>', '<h6>'], a: 1, w: '<code>&lt;h1&gt;</code> es el título de mayor jerarquía; <code>&lt;h6&gt;</code> es el menor.' },
      { q: 'En <p>Hola</p>, ¿qué es </p>?', o: ['Etiqueta de apertura', 'Etiqueta de cierre', 'Un atributo', 'Un comentario'], a: 1, w: 'La barra indica que la etiqueta cierra el elemento abierto antes.' }] }] }] }] },

{ id: 'css', icon: '{ }', title: 'CSS', desc: 'Diseño, color, tipografía y adaptación a cada pantalla.',
  soon: ['Módulo 2 · Modelo de caja y posicionamiento', 'Módulo 3 · Flexbox y Grid', 'Módulo 4 · Animaciones y diseño responsive'],
  modules: [{ title: 'Módulo 1 · Primeros pasos', units: [{ title: 'Unidad 1 · Tu primer estilo', lessons: [{
    id: 'css-1-1-1', title: 'Clase 1 · Reglas, selectores y colores',
    theory: `<p><b>CSS</b> decide cómo se ve lo que HTML describe. Se escribe en <b>reglas</b>: un <b>selector</b> (a quién) y un bloque entre llaves con <b>declaraciones</b> (qué cambiar).</p>
<pre><code>h1 {
  color: tomato;
  font-size: 40px;
}</code></pre>
<p>Cada declaración es <code>propiedad: valor;</code> y termina con punto y coma. Los selectores que vas a usar hoy:</p>
<ul><li><code>h1</code>: todas las etiquetas <code>h1</code>.</li><li><code>.nota</code>: los elementos con <code>class="nota"</code>. El punto es parte del selector.</li></ul>
<p>Propiedades: <code>color</code> (texto), <code>background-color</code> (fondo), <code>font-size</code>, <code>padding</code> (espacio interno), <code>border-radius</code> (esquinas redondeadas).</p>`,
    example: { tabs: ['html', 'css'], code: { html: '<h1>Hola, CSS</h1>\n<p class="aviso">Este texto tiene estilo.</p>', css: 'h1 {\n  color: #d6336c;\n}\n\n.aviso {\n  background-color: #fff3bf;\n  padding: 8px;\n}' },
      explain: [['h1 { … }', 'Selector de elemento: aplica a todos los <code>h1</code>.'], ['color: #d6336c;', 'Propiedad y valor; el <code>;</code> separa una declaración de la siguiente.'], ['.aviso', 'El punto indica una clase: coincide con <code>class="aviso"</code> del HTML.'], ['padding: 8px;', 'Espacio interno entre el texto y el borde del elemento.']] },
    mistakes: ['Olvidar el <code>;</code> entre declaraciones: la siguiente puede ignorarse.', 'Escribir <code>nota { }</code> en vez de <code>.nota { }</code>: sin el punto busca una etiqueta llamada <code>nota</code>.', 'Escribir mal la propiedad (<code>colour</code>, <code>backgroundcolor</code>): el navegador la ignora sin avisar.'],
    exercises: [{ id: 'css-1-1-1-a', type: 'Encontrar y corregir errores', title: 'Arreglá los estilos', tabs: ['html', 'css'],
      prompt: 'El título debería ser color tomate y de 40px, y la nota tener fondo <code>#eef</code> y 12px de padding. Hay dos errores en el CSS.',
      start: { html: '<h1>Bienvenida</h1>\n<p class="nota">Recordá practicar todos los días.</p>', css: 'h1 {\n  color: tomato\n  font-size: 40px;\n}\n\nnota {\n  background-color: #eef;\n  padding: 12px\n}' },
      hints: ['Mirá línea por línea si cada declaración termina como corresponde.', 'Una declaración está pegada a la siguiente. Ese error rompe las dos.', 'Las clases del HTML se seleccionan con un punto antes del nombre.'],
      checks: [{ n: 'El título mide 40px', t: "getComputedStyle(doc.querySelector('h1')).fontSize==='40px'", m: '<b>Qué pasó:</b> el tamaño no cambió. <b>Por qué:</b> falta el <code>;</code> tras <code>tomato</code>, así que el navegador lee <code>color: tomato font-size: 40px</code> como un solo valor inválido y descarta las dos. <b>Solución:</b> terminá cada declaración con <code>;</code>.' },
        { n: 'El título es color tomate', t: "getComputedStyle(doc.querySelector('h1')).color==='rgb(255, 99, 71)'", m: '<b>Qué pasó:</b> el color no es tomate. <b>Por qué:</b> es el mismo problema del punto y coma faltante. <b>Solución:</b> <code>color: tomato;</code>.' },
        { n: 'La nota tiene fondo y padding', t: "(()=>{const s=getComputedStyle(doc.querySelector('.nota'));return s.backgroundColor==='rgb(238, 238, 255)'&&s.paddingTop==='12px'})()", m: '<b>Qué pasó:</b> la nota no tiene estilo. <b>Por qué:</b> el selector <code>nota</code> busca etiquetas <code>&lt;nota&gt;</code>, que no existen. <b>Solución:</b> las clases llevan punto: <code>.nota { … }</code>.' }] }],
    challenge: { id: 'css-1-1-1-c', type: 'Crear pequeños elementos visuales', title: 'Una tarjeta con estilo', tabs: ['html', 'css'],
      prompt: 'Estilá la clase <code>.tarjeta</code>: un fondo de color (no blanco), <code>padding</code> de al menos 16px y <code>border-radius</code> de al menos 8px.',
      start: { html: '<div class="tarjeta">\n  <h2>Mi tarjeta</h2>\n  <p>Diseñada con CSS.</p>\n</div>', css: '/* Estilá .tarjeta */\n' },
      hints: ['Empezá con el selector: <code>.tarjeta { }</code>.', 'Las propiedades que necesitás: <code>background-color</code>, <code>padding</code>, <code>border-radius</code>.', 'Por ejemplo: <code>padding: 20px;</code> y <code>border-radius: 12px;</code>.'],
      checks: [{ n: 'Fondo de color', t: "(()=>{const b=getComputedStyle(doc.querySelector('.tarjeta')).backgroundColor;return b!=='rgba(0, 0, 0, 0)'&&b!=='rgb(255, 255, 255)'})()", m: '<b>Qué pasó:</b> la tarjeta no tiene fondo de color. <b>Por qué:</b> sin <code>background-color</code> queda transparente. <b>Solución:</b> <code>background-color: #ffe8cc;</code> (o el color que quieras).' },
        { n: 'Padding de 16px o más', t: "parseFloat(getComputedStyle(doc.querySelector('.tarjeta')).paddingTop)>=16", m: '<b>Qué pasó:</b> el padding es menor a 16px. <b>Por qué:</b> es el espacio entre el borde y el contenido. <b>Solución:</b> <code>padding: 20px;</code>.' },
        { n: 'Esquinas redondeadas (8px o más)', t: "parseFloat(getComputedStyle(doc.querySelector('.tarjeta')).borderTopLeftRadius)>=8", m: '<b>Qué pasó:</b> las esquinas no están redondeadas lo suficiente. <b>Por qué:</b> lo controla <code>border-radius</code>. <b>Solución:</b> <code>border-radius: 12px;</code>.' }] },
    quiz: [{ q: '¿Qué selector apunta a los elementos con class="aviso"?', o: ['aviso', '.aviso', '#aviso', '*aviso'], a: 1, w: 'El punto significa «clase». <code>#</code> es para ids.' },
      { q: 'Si olvidás el ; entre dos declaraciones, ¿qué suele pasar?', o: ['Nada, funciona igual', 'El navegador puede ignorar ambas', 'El sitio se vuelve más rápido', 'El navegador agrega el ; solo'], a: 1, w: 'Las dos quedan pegadas como un valor inválido y se descartan.' }] }] }] }] },

{ id: 'js', icon: 'JS', title: 'JavaScript', desc: 'Lógica, variables, funciones, eventos e interactividad.',
  soon: ['Módulo 2 · Condicionales y bucles', 'Módulo 3 · Funciones, arrays y objetos', 'Módulo 4 · DOM avanzado y asincronía'],
  modules: [{ title: 'Módulo 1 · Primeros pasos', units: [{ title: 'Unidad 1 · Tu primer botón interactivo', lessons: [{
    id: 'js-1-1-1', title: 'Clase 1 · Variables y eventos',
    theory: `<p><b>JavaScript</b> le da comportamiento a la página: reacciona a lo que hace la persona.</p>
<p>Una <b>variable</b> guarda un valor con nombre. <code>let</code> declara una que puede cambiar; <code>const</code>, una que no se reasigna.</p>
<pre><code>let veces = 0;
veces = veces + 1;</code></pre>
<p>Un <b>evento</b> es algo que sucede (un clic). Con <code>addEventListener</code> le decís al navegador qué función ejecutar cuando ocurra. Para tocar la página usás el <b>DOM</b>: <code>document.querySelector('#id')</code> busca un elemento y <code>.textContent</code> cambia su texto.</p>`,
    example: { tabs: ['html', 'js'], code: { html: '<button id="btn">Sumar un clic</button>\n<p id="salida">Clics: 0</p>', js: "const boton = document.querySelector('#btn');\nlet veces = 0;\n\nboton.addEventListener('click', () => {\n  veces = veces + 1;\n  document.querySelector('#salida').textContent = 'Clics: ' + veces;\n  console.log('Clic número', veces);\n});" },
      explain: [["const boton = …", 'Busca el botón por su id (<code>#btn</code>) y lo guarda. Es <code>const</code> porque siempre será el mismo botón.'], ['let veces = 0;', 'Variable que va a cambiar, por eso <code>let</code>.'], ["addEventListener('click', …)", 'Cada clic ejecuta la función flecha <code>() =&gt; { … }</code>.'], ['.textContent = …', 'Reemplaza el texto del párrafo. El <code>+</code> une texto y número.'], ['console.log(…)', 'Escribe en la consola: tu mejor herramienta para ver qué pasa.']] },
    mistakes: ['Buscar con <code>querySelector(\'btn\')</code> sin el <code>#</code>: busca una etiqueta <code>&lt;btn&gt;</code>, no el id.', 'Reasignar una <code>const</code>: da «Assignment to constant variable».', 'Escribir <code>addEventListener(click, …)</code> sin comillas: <code>click</code> sería una variable que no existe.'],
    exercises: [{ id: 'js-1-1-1-a', type: 'Completar código', title: 'El contador', tabs: ['html', 'js'],
      prompt: 'Completá los dos espacios en blanco (<code>____</code>) para que cada clic en el botón sume uno y muestre el total.',
      start: { html: '<button id="sumar">+1</button>\n<p>Total: <span id="total">0</span></p>', js: "let total = 0;\nconst boton = document.querySelector('#sumar');\n\nboton.addEventListener('____', () => {\n  total = total + 1;\n  document.querySelector('#total').textContent = ____;\n});" },
      hints: ['El primer blanco es el nombre del evento que ocurre al hacer clic.', 'El segundo blanco es lo que querés mostrar: el valor que lleva la cuenta.', 'Son <code>click</code> y <code>total</code> (sin comillas el segundo).'],
      checks: [{ n: 'Escucha el evento click', t: "/addEventListener\\s*\\(\\s*['\"]click['\"]/.test(code.js)", m: '<b>Qué pasó:</b> el botón no escucha el evento correcto. <b>Por qué:</b> el nombre del evento va entre comillas y se llama <code>click</code>. <b>Solución:</b> reemplazá el primer <code>____</code>.' },
        { n: 'Tras 3 clics muestra 3', t: "(()=>{const b=doc.querySelector('#sumar');b.click();b.click();b.click();return doc.querySelector('#total').textContent.trim()==='3'})()", m: '<b>Qué pasó:</b> después de 3 clics el total no es 3. <b>Por qué:</b> el segundo blanco debe ser la variable <code>total</code>; mientras quede <code>____</code>, la consola muestra un error. <b>Solución:</b> asigná <code>total</code> a <code>textContent</code>.' }] }],
    challenge: { id: 'js-1-1-1-c', type: 'Resolver un problema de lógica', title: 'Sumar y reiniciar', tabs: ['html', 'js'],
      prompt: 'Escribí el JavaScript para que <b>+1</b> sume uno al total y <b>Reiniciar</b> lo vuelva a 0.',
      start: { html: '<button id="sumar">+1</button>\n<button id="reiniciar">Reiniciar</button>\n<p>Total: <span id="total">0</span></p>', js: '// Escribí tu código acá\n' },
      hints: ['Necesitás una variable con <code>let</code> para llevar la cuenta.', 'Cada botón necesita su propio <code>addEventListener(\'click\', …)</code>.', 'Reiniciar hace <code>total = 0</code> y vuelve a escribir el total en pantalla.'],
      checks: [{ n: '+1 suma de a uno', t: "(()=>{const s=doc.querySelector('#sumar');s.click();s.click();return doc.querySelector('#total').textContent.trim()==='2'})()", m: '<b>Qué pasó:</b> dos clics en +1 no dan 2. <b>Por qué:</b> falta el evento o no actualizás el texto. <b>Solución:</b> en cada clic sumá 1 y asigná el total a <code>#total.textContent</code>.' },
        { n: 'Reiniciar vuelve a 0', t: "(()=>{const s=doc.querySelector('#sumar'),r=doc.querySelector('#reiniciar'),t=doc.querySelector('#total');s.click();const a=t.textContent.trim();r.click();return a!=='0'&&t.textContent.trim()==='0'})()", m: '<b>Qué pasó:</b> Reiniciar no deja el total en 0. <b>Por qué:</b> debés poner la variable en 0 <i>y</i> mostrarla. <b>Solución:</b> <code>total = 0;</code> y luego actualizá el texto.' }] },
    quiz: [{ q: '¿Cuál declara una variable que NO se puede reasignar?', o: ['let', 'const', 'var', 'function'], a: 1, w: '<code>const</code> impide reasignar el nombre; <code>let</code> sí lo permite.' },
      { q: '¿Qué hace addEventListener(\'click\', f)?', o: ['Ejecuta f cada vez que se hace clic', 'Crea un botón', 'Cambia el color de la página', 'Guarda datos en disco'], a: 0, w: 'Registra una función para que el navegador la llame cuando ocurra el evento.' }] }] }] }] },

{ id: 'php', icon: '<?', title: 'PHP', desc: 'Programación del lado del servidor, formularios y bases de datos.',
  soon: ['Módulo 2 · Condicionales, bucles y arrays', 'Módulo 3 · Formularios y sesiones', 'Módulo 4 · Bases de datos'],
  modules: [{ title: 'Módulo 1 · Primeros pasos', units: [{ title: 'Unidad 1 · Tu primer script', lessons: [{
    id: 'php-1-1-1', title: 'Clase 1 · Variables y echo',
    theory: `<p><b>PHP</b> se ejecuta en el <b>servidor</b>, no en el navegador: el navegador recibe solo el resultado. Esta academia funciona solo en el navegador, así que tus ejercicios de PHP se revisan leyendo tu código, sin ejecutarlo.</p>
<svg viewBox="0 0 520 130" role="img" aria-label="El navegador pide una página, el servidor ejecuta PHP y responde con HTML" style="max-width:520px;width:100%;color:#f2d675;margin:6px 0 10px"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="30" width="130" height="70" rx="8"/><rect x="382" y="30" width="130" height="70" rx="8"/><path d="M142 55h234m-8-6 8 6-8 6"/><path d="M376 80H142m8-6-8 6 8 6"/></g><g fill="currentColor" font-family="system-ui,sans-serif" font-size="14" text-anchor="middle"><text x="73" y="70">Navegador</text><text x="447" y="62">Servidor</text><text x="447" y="82">ejecuta PHP</text><text x="259" y="46" font-size="12">1. pide la página</text><text x="259" y="106" font-size="12">2. recibe solo HTML</text></g></svg>
<p>El código va después de <code>&lt;?php</code>. Cada instrucción termina con <code>;</code>. Las variables empiezan con <code>$</code> y <code>echo</code> envía texto a la salida.</p>
<pre><code>&lt;?php
$nombre = "Ana";
echo "Hola, " . $nombre;</code></pre>
<p>Para unir textos PHP usa el punto <code>.</code>. Con comillas dobles, PHP reemplaza las variables que aparecen adentro; con comillas simples, no.</p>`,
    example: { tabs: ['php'], demo: '<h1>Hola, Ana</h1><p>El año que viene tendrás 31 años.</p>', code: { php: '<?php\n$nombre = "Ana";\n$edad = 30;\n\necho "<h1>Hola, $nombre</h1>";\necho "<p>El año que viene tendrás " . ($edad + 1) . " años.</p>";' },
      explain: [['<?php', 'Abre el modo PHP: lo que sigue se ejecuta en el servidor.'], ['$nombre = "Ana";', 'Guarda un texto en una variable. Las variables siempre llevan <code>$</code>.'], ['echo', 'Envía texto a la salida; es lo que verás en la vista previa.'], ['"Hola, $nombre"', 'Con comillas dobles PHP reemplaza la variable por su valor.'], ['. ($edad + 1) .', 'El punto une textos; los paréntesis fuerzan a calcular primero la suma.']] },
    mistakes: ['Olvidar el <code>$</code> al crear o usar una variable.', 'Usar <code>+</code> para unir textos (eso es JavaScript): en PHP es el punto <code>.</code>.', 'Olvidar el <code>;</code> al final: da «Parse error: syntax error».', 'Usar comillas simples esperando que reemplacen variables: <code>\'Hola $nombre\'</code> muestra el texto literal.'],
    exercises: [{ id: 'php-1-1-1-a', type: 'Encontrar y corregir errores', title: 'El saludo roto', tabs: ['php'],
      prompt: 'Este script debería mostrar <code>Hola, Lucía</code>, pero tiene tres errores. Corregilos y comprobá.',
      start: { php: '<?php\nnombre = "Lucía";\necho "Hola, " + $nombre\n' },
      hints: ['Las variables en PHP empiezan con <code>$</code> también cuando les asignás un valor.', 'En PHP los textos se unen con un punto <code>.</code>, no con <code>+</code>.', 'Cada instrucción termina con <code>;</code>.'],
      checks: [{ n: 'La variable $nombre se crea con $', t: "/^\\s*\\$nombre\\s*=\\s*[\"']Luc[ií]a[\"']\\s*;/m.test(code.php)", m: '<b>Qué pasó:</b> la variable no está bien creada. <b>Por qué:</b> toda variable de PHP lleva <code>$</code>, también al asignarle un valor. <b>Solución:</b> <code>$nombre = "Lucía";</code>.' },
        { n: 'El texto y la variable se unen con punto', t: "/echo\\s+[\"']Hola, [\"']\\s*\\.\\s*\\$nombre\\s*;|echo\\s+\"Hola, \\$nombre\"\\s*;/.test(code.php)", m: '<b>Qué pasó:</b> el <code>echo</code> no muestra «Hola, » seguido de <code>$nombre</code>. <b>Por qué:</b> el <code>+</code> es de JavaScript; PHP une textos con <code>.</code>. <b>Solución:</b> <code>echo "Hola, " . $nombre;</code>.' },
        { n: 'Cada instrucción termina en ;', t: "code.php.split('\\n').map(s=>s.trim()).filter(s=>s&&!s.startsWith('<?php')&&!s.startsWith('//')).every(s=>s.endsWith(';'))", m: '<b>Qué pasó:</b> alguna línea no termina en <code>;</code>. <b>Por qué:</b> sin punto y coma PHP da «Parse error: syntax error». <b>Solución:</b> cerrá cada instrucción con <code>;</code>.' }] }],
    challenge: { id: 'php-1-1-1-c', type: 'Escribir código desde cero', title: 'El total de la compra', tabs: ['php'],
      prompt: 'Definí <code>$precio = 1500</code> y <code>$cantidad = 3</code>, calculá el total y mostralo con <code>echo</code> así: <code>&lt;p&gt;Total: 4500&lt;/p&gt;</code>.',
      start: { php: '<?php\n// Definí $precio y $cantidad, calculá el total y mostralo con echo.\n' },
      hints: ['Creá las dos variables con <code>$</code> y <code>=</code>.', 'Multiplicá con <code>*</code>: <code>$total = $precio * $cantidad;</code>.', '<code>echo "&lt;p&gt;Total: " . $total . "&lt;/p&gt;";</code>'],
      checks: [{ n: 'Define $precio = 1500 y $cantidad = 3', t: "/\\$precio\\s*=\\s*1500\\s*;/.test(code.php)&&/\\$cantidad\\s*=\\s*3\\s*;/.test(code.php)", m: '<b>Qué pasó:</b> faltan las variables con esos valores. <b>Por qué:</b> el ejercicio parte de <code>$precio = 1500</code> y <code>$cantidad = 3</code>. <b>Solución:</b> escribí ambas líneas, cada una terminada en <code>;</code>.' },
        { n: 'Calcula el total multiplicando', t: "/\\$\\w+\\s*=\\s*(?:\\$precio\\s*\\*\\s*\\$cantidad|\\$cantidad\\s*\\*\\s*\\$precio)\\s*;/.test(code.php)", m: '<b>Qué pasó:</b> no veo el cálculo. <b>Por qué:</b> el total debe salir de multiplicar las dos variables, no estar escrito a mano. <b>Solución:</b> <code>$total = $precio * $cantidad;</code>.' },
        { n: 'Muestra <p>Total: …</p> con echo', t: "/echo[^;]*<p>Total:[^;]*<\\/p>/.test(code.php)", m: '<b>Qué pasó:</b> el <code>echo</code> no arma <code>&lt;p&gt;Total: …&lt;/p&gt;</code>. <b>Por qué:</b> el párrafo se escribe como texto y se une al total con <code>.</code>. <b>Solución:</b> <code>echo "&lt;p&gt;Total: " . $total . "&lt;/p&gt;";</code>.' }] },
    quiz: [{ q: '¿Con qué símbolo se unen textos en PHP?', o: ['+', '. (punto)', '&', ','], a: 1, w: 'El punto es el operador de concatenación. El <code>+</code> es solo para sumar números.' },
      { q: '¿Dónde se ejecuta PHP?', o: ['En el navegador', 'En el servidor', 'En la tarjeta gráfica', 'Dentro del CSS'], a: 1, w: 'El servidor ejecuta el código y envía al navegador solo el resultado.' }] }] }] }] }
];

const PROJECTS = [{
  id: 'proj-pagina-personal', title: 'Proyecto 1 · Tu página web personal', tabs: ['html', 'css'],
  goal: 'Armar y diseñar una página de presentación usando lo aprendido en HTML y CSS.',
  reqs: ['Un <code>&lt;h1&gt;</code> con tu nombre.', 'Al menos dos párrafos que cuenten quién sos y qué querés aprender.', 'Al menos una palabra importante en <code>&lt;strong&gt;</code>.', 'Un color de fondo para <code>body</code> (que no sea blanco).', 'Una regla de CSS para <code>h1</code> que cambie su <code>color</code>.'],
  start: { html: '<!-- Escribí tu página personal -->\n', css: '/* Dale estilo a tu página */\n' },
  hints: ['Primero el contenido (HTML), después el estilo (CSS).', 'Para el fondo: <code>body { background-color: #fdf6e3; }</code>.', 'Para el título: <code>h1 { color: #b5523b; }</code>.'],
  checks: [{ n: 'Título h1 con tu nombre', t: "(doc.querySelector('h1')?.textContent.trim().length||0)>0", m: '<b>Falta:</b> un <code>&lt;h1&gt;</code> con texto.' },
    { n: 'Al menos dos párrafos', t: "doc.querySelectorAll('p').length>=2", m: '<b>Falta:</b> al menos dos <code>&lt;p&gt;</code>.' },
    { n: 'Una palabra en strong', t: "!!doc.querySelector('strong')", m: '<b>Falta:</b> una palabra dentro de <code>&lt;strong&gt;</code>.' },
    { n: 'Fondo de color en body', t: "(()=>{const b=getComputedStyle(doc.body).backgroundColor;return b!=='rgba(0, 0, 0, 0)'&&b!=='rgb(255, 255, 255)'})()", m: '<b>Falta:</b> <code>body { background-color: …; }</code> con un color que no sea blanco.' },
    { n: 'Regla de color para h1', t: "/h1\\s*\\{[^}]*color\\s*:/.test(code.css)", m: '<b>Falta:</b> una regla <code>h1 { color: …; }</code> en la pestaña CSS.' }],
  preview: '<body style="background:#fdf6e3;font-family:Georgia,serif;margin:20px"><h1 style="color:#b5523b">Lucía Fernández</h1><p>Soy <strong>diseñadora</strong> y estoy aprendiendo a programar.</p><p>Quiero crear mi propio sitio web.</p></body>'
}];

'use strict';
/* Academia Web · motor: progreso, editor, ejecución, corrección y vistas. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const h = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const debounce = (f, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => f(...a), ms); }; };
const fmtTime = s => s >= 3600 ? `${Math.floor(s / 3600)} h ${Math.floor(s % 3600 / 60)} min` : `${Math.floor(s / 60)} min`;

/* ---------- Progreso (localStorage) ---------- */
const Store = {
  key: 'academia.v1',
  d: { lessons: {}, projects: {}, code: {}, free: {}, last: null, seconds: 0 },
  load() { try { Object.assign(this.d, JSON.parse(localStorage.getItem(this.key)) || {}); } catch (e) { console.warn(e); } },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.d)); } catch (e) { alert('No se pudo guardar el progreso: ' + e.message); } },
  lesson(id) { return (this.d.lessons[id] ||= { ex: {}, quiz: null, sec: 0 }); },
};
const lessonsOf = c => c.modules.flatMap(m => m.units.flatMap(u => u.lessons));
const allEx = l => [...l.exercises, l.challenge];
const exDone = (l, e) => !!Store.d.lessons[l.id]?.ex?.[e.id]?.done;
const lessonDone = l => allEx(l).every(e => exDone(l, e)) && (Store.d.lessons[l.id]?.quiz ?? -1) >= 60;
const lessonStarted = l => { const s = Store.d.lessons[l.id]; return !!s && (Object.keys(s.ex || {}).length > 0 || s.quiz != null); };
const findLesson = id => { for (const c of COURSES) for (const l of lessonsOf(c)) if (l.id === id) return [c, l]; return []; };

/* ---------- Espacio de trabajo: editor + vista previa + consola ---------- */
const WS = [];
window.addEventListener('message', e => { if (e.data?.s === 'acad') WS.find(w => w.frame.contentWindow === e.source)?.onMsg(e.data); });
const LABEL = { html: 'HTML', css: 'CSS', js: 'JavaScript', php: 'PHP' };
// Se inyecta en la vista previa: reenvía la consola y los errores, y evalúa las comprobaciones dentro de la página.
const HARNESS = `<script>(()=>{const P=(t,d,l)=>parent.postMessage({s:'acad',t,d,l},'*'),L=[],f=a=>a.map(x=>{if(typeof x!=='object'||x===null)return String(x);try{return JSON.stringify(x)}catch(e){return String(x)}}).join(' ');
['log','info','warn','error'].forEach(k=>{const o=console[k];console[k]=(...a)=>{L.push(f(a));P(k,f(a));o.apply(console,a)}});
addEventListener('error',e=>P('error',e.message,e.lineno));
addEventListener('unhandledrejection',e=>P('error','Promesa rechazada: '+e.reason));
addEventListener('load',()=>P('loaded'));
addEventListener('message',async e=>{if(!e.data||e.data.s!=='chk')return;const r=[];
for(const c of e.data.checks){let ok=false;try{ok=!!await new Function('doc','code','logs','return ('+c+')')(document,e.data.code,L)}catch(x){}r.push(ok)}P('chk',r)});
<\/script>`;

/* Editor propio: un textarea transparente sobre una capa con el código resaltado. Sin librerías. */
const lex = rules => {
  const re = new RegExp(rules.map(r => '(' + r[0].source + ')').join('|'), 'g');
  return s => {
    let o = '', i = 0, m; re.lastIndex = 0;
    while ((m = re.exec(s))) {
      if (!m[0]) { re.lastIndex++; continue; }
      const k = m.slice(1).findIndex(x => x !== undefined);
      o += esc(s.slice(i, m.index)) + `<i class="${rules[k][1]}">${esc(m[0])}</i>`;
      i = m.index + m[0].length;
    }
    return o + esc(s.slice(i));
  };
};
const NUM = /\b\d+(?:\.\d+)?\b/, FN = /[A-Za-z_$][\w$]*(?=\s*\()/;
const LEX = {
  html: lex([[/<!--[\s\S]*?-->|<![a-zA-Z][^>]*>/, 'c'], [/<\/?[a-zA-Z][\w-]*/, 't'], [/=\s*(?:"[^"<>]*"|'[^'<>]*')/, 's'], [/[\w:-]+(?==)/, 'a']]),
  css: lex([[/\/\*[\s\S]*?\*\//, 'c'], [/"[^"\n]*"|'[^'\n]*'/, 's'], [/@[\w-]+/, 'k'], [/#[0-9a-fA-F]{3,8}\b/, 'n'], [/\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|ms|s|deg|fr)?/, 'n'], [/[.#]?[a-zA-Z_][\w-]*(?=[^;{}]*\{)/, 't'], [/[a-z-]+(?=\s*:\s*[^;{]*[;}])/, 'a']]),
  js: lex([[/\/\/[^\n]*|\/\*[\s\S]*?\*\//, 'c'], [/"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/, 's'], [/\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|async|await|try|catch|throw|typeof|of|in|this|true|false|null|undefined)\b/, 'k'], [NUM, 'n'], [FN, 'f']]),
  php: lex([[/\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\//, 'c'], [/"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/, 's'], [/<\?php|\?>/, 'm'], [/\$[A-Za-z_]\w*/, 'v'], [/\b(?:echo|print|if|else|elseif|foreach|for|while|function|return|array|true|false|null|new|class|as)\b/, 'k'], [NUM, 'n'], [FN, 'f']]),
};

class Workspace {
  constructor(root, { id, tabs, start = {}, demo }) {
    Object.assign(this, { root, id, tabs, start, demo, val: {}, err: {} });
    const saved = Store.d.code[id] || {};
    tabs.forEach(t => (this.val[t] = saved[t] ?? start[t] ?? ''));
    root.innerHTML = `<div class="ws"><div class="ws-ed">
      <div class="tabs">${tabs.map(t => `<button data-t="${t}">${LABEL[t]}</button>`).join('')}</div>
      <div class="ed"><div class="gut" aria-hidden="true"></div><div class="cw"><pre class="hl" aria-hidden="true"></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off" wrap="off" aria-label="Editor de código"></textarea></div></div>
      <div class="bar"><button class="btn pri" data-a="run" title="Ctrl+Enter">▶ Ejecutar</button><button class="btn" data-a="stop">■ Detener</button><button class="btn" data-a="clear">Limpiar pestaña</button><button class="btn" data-a="reset">Restaurar original</button></div>
    </div><div class="ws-out">
      <div class="lbl">Vista previa</div><iframe sandbox="allow-scripts allow-modals allow-forms" title="Vista previa"></iframe>
      <div class="lbl">Consola <button class="lnk" data-a="cc">vaciar</button></div><pre class="con"></pre>
    </div></div>`;
    Object.assign(this, { frame: $('iframe', root), con: $('.con', root), ta: $('textarea', root), hl: $('.hl', root), gut: $('.gut', root) });
    this.save = debounce(() => { Store.d.code[this.id] = this.code(); Store.save(); }, 400);
    const ta = this.ta;
    const ins = s => { if (!document.execCommand('insertText', false, s)) { ta.setRangeText(s, ta.selectionStart, ta.selectionEnd, 'end'); ta.dispatchEvent(new Event('input')); } };
    ta.addEventListener('input', () => { this.paint(); this.save(); });
    ta.addEventListener('scroll', () => this.scroll());
    ta.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); this.run(); }
      else if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); ins('  '); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        const v = ta.value, p = ta.selectionStart, line = v.slice(p ? v.lastIndexOf('\n', p - 1) + 1 : 0, p);
        ins('\n' + line.match(/^\s*/)[0] + (/[{(\[]\s*$/.test(line) ? '  ' : ''));
      }
    });
    root.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.t) this.show(b.dataset.t);
      if (['run', 'stop', 'clear', 'reset', 'cc'].includes(b.dataset.a)) this[b.dataset.a]();
    });
    this.show(tabs[0], false);
    WS.push(this);
  }
  show(t, focus = true) {
    if (this.active) this.val[this.active] = this.ta.value;
    this.active = t; this.ta.value = this.val[t];
    $$('.tabs button', this.root).forEach(b => b.classList.toggle('on', b.dataset.t === t));
    this.paint(); this.ta.scrollTop = this.ta.scrollLeft = 0; this.scroll();
    if (focus) this.ta.focus();
  }
  paint() {
    const v = this.ta.value, e = this.err[this.active];
    this.hl.innerHTML = (e ? `<div class="errl" style="top:${10 + (e - 1) * 21}px"></div>` : '') + LEX[this.active](v) + '\n';
    this.gut.textContent = Array.from({ length: v.split('\n').length }, (_, i) => i + 1).join('\n');
  }
  scroll() { this.hl.scrollTop = this.gut.scrollTop = this.ta.scrollTop; this.hl.scrollLeft = this.ta.scrollLeft; }
  code() { this.val[this.active] = this.ta.value; return { ...this.val }; }
  setVal(t, v) { this.val[t] = v; if (t === this.active) this.ta.value = v; this.paint(); this.save(); }
  log(k, t) { const d = document.createElement('div'); d.className = 'c-' + k; d.textContent = t; this.con.append(d); this.con.scrollTop = this.con.scrollHeight; }
  cc() { this.con.replaceChildren(); }
  mark(t, n) {
    if (!this.tabs.includes(t)) return;
    const v = t === this.active ? this.ta.value : this.val[t];
    if (n < 1 || n > v.split('\n').length) return;
    this.err[t] = n; if (t === this.active) this.paint(); else this.show(t, false);
  }
  stop() { this.frame.srcdoc = ''; this.log('info', '■ Ejecución detenida.'); }
  clear() { this.setVal(this.active, ''); }
  reset() { if (confirm('¿Restaurar el código original? Se pierden tus cambios en este espacio.')) this.tabs.forEach(t => this.setVal(t, this.start[t] ?? '')); }
  async run() {
    const c = this.code(); this.err = {}; this.paint(); this.cc();
    if (this.tabs.includes('php')) {   // PHP necesita un servidor: acá solo se muestra el resultado del ejemplo original
      this.frame.srcdoc = this.demo ? `<body style="font-family:system-ui;margin:16px">${this.demo}</body>` : '<body style="font:15px system-ui;margin:16px;color:#555"><p>PHP se ejecuta en un servidor, no en el navegador. Usá «Comprobar solución» para que la academia revise tu código.</p></body>';
      this.log('info', this.demo ? 'Resultado que produce el código original en un servidor con PHP. Tus cambios no se ejecutan acá.' : 'PHP no se ejecuta en el navegador: tu código se revisa al comprobar.');
      return true;
    }
    const pre = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html{background:#fff;color:#111}</style>${HARNESS}<style>${c.css ?? ''}</style></head><body>${c.html ?? ''}\n<script>`;
    this.jsOffset = pre.split('\n').length - 1;
    const loaded = new Promise(r => (this._loaded = r));
    this.frame.srcdoc = pre + (c.js ?? '') + '<\/script></body></html>';
    await Promise.race([loaded, new Promise(r => setTimeout(r, 4000))]);
    return true;
  }
  onMsg(m) {
    if (m.t === 'loaded') this._loaded?.();
    else if (m.t === 'chk') this._chk?.(m.d);
    else if (m.t === 'error' && m.l) { const n = m.l - this.jsOffset; this.log('error', m.d + (n > 0 ? ` (línea ${n} de JavaScript)` : '')); this.mark('js', n); }
    else this.log(m.t, m.d);
  }
  // Devuelve un arreglo de booleanos (uno por comprobación).
  async check(checks) {
    const code = this.code();
    if (this.tabs.join() === 'php') {   // PHP: se revisa el texto del código
      await this.run();
      return checks.map(c => { try { return !!new Function('code', 'return (' + c.t + ')')(code); } catch (e) { return false; } });
    }
    await this.run();
    return new Promise(res => { this._chk = res; this.frame.contentWindow.postMessage({ s: 'chk', checks: checks.map(c => c.t), code }, '*'); setTimeout(() => res(checks.map(() => false)), 4000); });
  }
}

/* ---------- Ejercicio / desafío / proyecto (con pistas y corrección) ---------- */
function Exercise(root, ex, st, cb) {
  root.innerHTML = `<div class="ex"><div class="ex-h"><span class="tag">${esc(ex.type)}</span><h3>${esc(ex.title)}</h3><span class="ok-b" hidden>✔ Resuelto</span></div>
    <div class="prompt">${ex.prompt || ''}${ex.tabs.includes('php') ? '<p class="mut">PHP necesita un servidor, así que acá no se ejecuta: «Comprobar solución» revisa tu código.</p>' : ''}</div><div class="wsx"></div>
    <div class="ex-bar"><button class="btn pri" data-a="chk">✓ Comprobar solución</button><button class="btn" data-a="hint"></button></div><div class="hints"></div><div class="res" aria-live="polite"></div></div>`;
  const ws = new Workspace($('.wsx', root), { id: ex.id, tabs: ex.tabs, start: ex.start });
  const hb = $('[data-a=hint]', root), res = $('.res', root);
  const sync = () => {
    const n = st.hints || 0;
    $('.ok-b', root).hidden = !st.done; hb.textContent = `💡 Pista (${n}/${ex.hints.length})`; hb.disabled = n >= ex.hints.length;
    $('.hints', root).innerHTML = ex.hints.slice(0, n).map((t, i) => `<div class="hint"><b>Pista ${i + 1}:</b> ${t}</div>`).join('');
  };
  sync();
  hb.onclick = () => { st.hints = (st.hints || 0) + 1; Store.save(); sync(); };
  $('[data-a=chk]', root).onclick = async () => {
    res.innerHTML = '<p class="mut">Ejecutando y comprobando…</p>';
    const r = await ws.check(ex.checks);
        const ok = r.every(Boolean);
    res.innerHTML = (ok ? '<p class="good">🎉 ¡Correcto! Cumplís todos los objetivos.</p>' : '<p class="bad">Todavía no está. Esto es lo que falta:</p>') +
      '<ul class="chk">' + ex.checks.map((c, i) => r[i] ? `<li class="p">✔ ${esc(c.n)}</li>` : `<li class="f">✖ <b>${esc(c.n)}</b><span>${c.m}</span></li>`).join('') + '</ul>';
    if (ok && !st.done) { st.done = true; Store.save(); sync(); cb?.(); }
  };
}

function Quiz(root, l, cb) {
  const s = Store.lesson(l.id);
  root.innerHTML = `<div class="quiz"><p class="mut">Necesitás 60 % o más para dar la clase por aprendida. Podés reintentar.</p>${l.quiz.map((q, i) => `<fieldset><legend>${i + 1}. ${esc(q.q)}</legend>${q.o.map((o, j) => `<label><input type="radio" name="q${i}" value="${j}"> ${esc(o)}</label>`).join('')}<div class="why" hidden></div></fieldset>`).join('')}<button class="btn pri">Comprobar respuestas</button><p class="qres">${s.quiz != null ? `Tu mejor nota: <b>${s.quiz} %</b>` : ''}</p></div>`;
  $('button', root).onclick = () => {
    let ok = 0;
    $$('fieldset', root).forEach((f, i) => {
      const q = l.quiz[i], v = f.querySelector('input:checked')?.value, w = $('.why', f), good = +v === q.a;
      ok += good; w.hidden = false; w.className = 'why ' + (good ? 'p' : 'f');
      w.innerHTML = (good ? '✔ Correcto. ' : v === undefined ? '✖ Sin responder. ' : '✖ Esa no es. ') + q.w;
    });
    const score = Math.round(100 * ok / l.quiz.length);
    s.quiz = Math.max(s.quiz ?? 0, score); Store.save();
    $('.qres', root).innerHTML = `Resultado: <b>${score} %</b> · mejor nota: <b>${s.quiz} %</b> — ${score >= 60 ? 'aprobado ✔' : 'repasá la teoría e intentá de nuevo'}`;
    cb?.();
  };
}

/* ---------- Vistas ---------- */
const App = { lesson: null };

function Home(view) {
  const last = Store.d.last && findLesson(Store.d.last.id)[1];
  view.innerHTML = `<section class="hero"><h1>Aprendé a programar escribiendo código de verdad.</h1><p class="lead">HTML, CSS, JavaScript y PHP, con editor, práctica, corrección y evaluaciones. Todo corre en tu computadora.</p>${last ? `<a class="btn pri" href="#/leccion/${last.id}">Continuar: ${last.title}</a>` : ''}</section>
    <div class="cards">${COURSES.map(c => { const ls = lessonsOf(c), d = ls.filter(lessonDone).length;
      return `<a class="card" href="#/curso/${c.id}"><div class="ic">${esc(c.icon)}</div><h3>${c.title}</h3><p>${c.desc}</p><div class="bar2"><i style="width:${100 * d / ls.length}%"></i></div><small>${d} de ${ls.length} clases disponibles completadas</small></a>`; }).join('')}</div>`;
}

function Course(view, id) {
  const c = COURSES.find(x => x.id === id);
  if (!c) { view.innerHTML = '<p>No encontré ese curso.</p>'; return; }
  view.innerHTML = `<a class="back" href="#/">← Cursos</a><h1>${c.title}</h1><p class="lead">${c.desc}</p>` +
    c.modules.map(m => `<section class="mod"><h2>${m.title}</h2>${m.units.map(u => `<h3>${u.title}</h3><ul class="les">${u.lessons.map(l => `<li><a href="#/leccion/${l.id}"><span class="dot ${lessonDone(l) ? 'd' : lessonStarted(l) ? 's' : ''}"></span>${l.title}</a></li>`).join('')}</ul>`).join('')}</section>`).join('') +
    `<section class="mod soon"><h2>Próximamente</h2><ul>${c.soon.map(s => `<li>${s}</li>`).join('')}</ul></section>`;
}

function Lesson(view, id) {
  const [c, l] = findLesson(id);
  if (!l) { view.innerHTML = '<p>No encontré esa clase.</p>'; return; }
  Store.d.last = { id }; Store.save(); App.lesson = id;
  const s = Store.lesson(id);
  const steps = [['teoria', 'Teoría'], ['ejemplo', 'Ejemplo'], ['practica', 'Ejercicios'], ['desafio', 'Desafío final'], ['quiz', 'Evaluación']];
  const done = k => ({ practica: l.exercises.every(e => exDone(l, e)), desafio: exDone(l, l.challenge), quiz: (s.quiz ?? -1) >= 60 }[k] || false);
  view.innerHTML = `<a class="back" href="#/curso/${c.id}">← Curso de ${c.title}</a><h1>${l.title}</h1><div class="steps">${steps.map(([k, t], i) => `<button data-k="${k}">${i + 1}. ${t}</button>`).join('')}</div><div class="banner" hidden>🎓 ¡Clase completada! Resolviste los ejercicios, el desafío y aprobaste la evaluación.</div><div class="step"></div>`;
  const bar = $('.steps', view), body = $('.step', view), banner = $('.banner', view);
  let cur = 'teoria';
  const refresh = () => { banner.hidden = !lessonDone(l); $$('button', bar).forEach(b => { b.classList.toggle('on', b.dataset.k === cur); b.dataset.ok = done(b.dataset.k) ? '1' : ''; }); };
  const add = fn => { const d = h('<div></div>'); body.append(d); fn(d); };
  const go = k => {
    cur = k; WS.length = 0; body.replaceChildren();
    if (k === 'teoria') body.append(h(`<div class="prose">${l.theory}<h2>Errores comunes</h2><ul class="warn">${l.mistakes.map(m => `<li>${m}</li>`).join('')}</ul></div>`));
    if (k === 'ejemplo') add(d => { d.innerHTML = `<p class="mut">Modificá el código y presioná «Ejecutar» para ver qué cambia. No hay nada que romper: «Restaurar original» deja todo como estaba.</p><dl class="expl">${l.example.explain.map(([a, b]) => `<dt><code>${esc(a)}</code></dt><dd>${b}</dd>`).join('')}</dl><div class="wsx"></div>`; new Workspace($('.wsx', d), { id: l.id + '-ej', tabs: l.example.tabs, start: l.example.code, demo: l.example.demo }); });
    if (k === 'practica') l.exercises.forEach(e => add(d => Exercise(d, e, s.ex[e.id] ||= {}, refresh)));
    if (k === 'desafio') add(d => Exercise(d, l.challenge, s.ex[l.challenge.id] ||= {}, refresh));
    if (k === 'quiz') add(d => Quiz(d, l, refresh));
    refresh();
  };
  bar.onclick = e => { const b = e.target.closest('button'); if (b) go(b.dataset.k); };
  go('teoria');
}

function Projects(view) {
  view.innerHTML = '<h1>Proyectos guiados</h1><p class="lead">Aplicá lo aprendido en algo real. Cada proyecto tiene objetivo, requisitos y un resultado esperado.</p>';
  PROJECTS.forEach(p => {
    const box = h(`<article class="proj"><h2>${p.title}</h2><p><b>Objetivo:</b> ${p.goal}</p><p><b>Requisitos:</b></p><ul>${p.reqs.map(r => `<li>${r}</li>`).join('')}</ul><details><summary>Ver resultado esperado</summary><iframe sandbox title="Resultado esperado" class="exp"></iframe></details><div class="wsr"></div></article>`);
    $('iframe', box).srcdoc = p.preview; view.append(box);
    Exercise($('.wsr', box), { ...p, type: 'Proyecto' }, Store.d.projects[p.id] ||= {});
  });
}

function Lab(view, fid) {
  const F = Store.d.free;
  if (!fid) {
    view.innerHTML = `<h1>Laboratorio libre</h1><p class="lead">Tus propios proyectos, sin consignas. Tenés HTML, CSS y JavaScript, y tu trabajo se guarda solo.</p><p><button class="btn pri" id="nuevo">＋ Nuevo proyecto</button></p><ul class="les">${Object.entries(F).map(([k, v]) => `<li><a href="#/laboratorio/${k}">${esc(v.name)}</a></li>`).join('') || '<li class="mut">Todavía no creaste ninguno.</li>'}</ul>`;
    $('#nuevo', view).onclick = () => { const name = prompt('Nombre del proyecto:'); if (!name) return; const k = 'p' + Date.now().toString(36); F[k] = { name }; Store.save(); location.hash = '#/laboratorio/' + k; };
    return;
  }
  const p = F[fid]; if (!p) { location.hash = '#/laboratorio'; return; }
  view.innerHTML = `<a class="back" href="#/laboratorio">← Laboratorio</a><h1>${esc(p.name)}</h1><div class="wsx"></div><p><button class="btn" id="ren">Renombrar</button> <button class="btn" id="del">Eliminar proyecto</button></p>`;
  new Workspace($('.wsx', view), { id: 'free-' + fid, tabs: ['html', 'css', 'js'], start: { html: '<h1>Mi proyecto</h1>\n<p>Empezá a escribir.</p>', css: 'h1 { color: tomato; }', js: '' } });
  $('#ren', view).onclick = () => { const n = prompt('Nuevo nombre:', p.name); if (n) { p.name = n; Store.save(); Lab(view, fid); } };
  $('#del', view).onclick = () => { if (confirm('¿Eliminar este proyecto y su código?')) { delete F[fid]; delete Store.d.code['free-' + fid]; Store.save(); location.hash = '#/laboratorio'; } };
}

function Progress(view) {
  const D = Store.d, ls = COURSES.flatMap(lessonsOf);
  const rows = ls.filter(l => D.lessons[l.id]?.quiz != null).map(l => `<tr><td>${l.title}</td><td>${D.lessons[l.id].quiz} %</td><td>${lessonDone(l) ? '✔ completada' : 'en curso'}</td></tr>`).join('');
  const stat = (n, t) => `<div><b>${n}</b>${t}</div>`;
  view.innerHTML = `<h1>Mi progreso</h1><div class="stats">${stat(`${ls.filter(lessonDone).length}/${ls.length}`, 'clases completadas')}${stat(ls.flatMap(l => l.exercises.filter(e => exDone(l, e))).length, 'ejercicios resueltos')}${stat(ls.filter(l => exDone(l, l.challenge)).length, 'desafíos completados')}${stat(PROJECTS.filter(p => D.projects[p.id]?.done).length, 'proyectos guiados')}${stat(Object.keys(D.free).length, 'proyectos libres')}${stat(fmtTime(D.seconds), 'tiempo de aprendizaje')}</div>
    <h2>Calificaciones</h2>${rows ? `<table><tr><th>Clase</th><th>Mejor nota</th><th>Estado</th></tr>${rows}</table>` : '<p class="mut">Cuando rindas una evaluación vas a ver tu nota acá.</p>'}
    <h2>Copia de seguridad</h2><p class="mut">Guardá tu progreso y tu código en un archivo, o restauralo en otra computadora.</p>
    <p><button class="btn pri" id="exp">Exportar progreso</button> <label class="btn">Importar progreso<input id="imp" type="file" accept="application/json,.json" hidden></label></p>`;
  $('#exp', view).onclick = () => {
    const a = h('<a></a>'); a.href = URL.createObjectURL(new Blob([JSON.stringify({ app: 'academia-web', v: 1, at: new Date().toISOString(), data: Store.d }, null, 2)], { type: 'application/json' }));
    a.download = `academia-progreso-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  $('#imp', view).onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const j = JSON.parse(await f.text());
      if (j.app !== 'academia-web' || !j.data) throw new Error('el archivo no es una copia de Academia Web.');
      if (!confirm('Esto reemplaza tu progreso actual. ¿Continuar?')) return;
      Store.d = { lessons: {}, projects: {}, code: {}, free: {}, last: null, seconds: 0, ...j.data }; Store.save(); route();
    } catch (err) { alert('No se pudo importar: ' + err.message); }
  };
}

/* ---------- Rutas y arranque ---------- */
const routes = [[/^#\/?$/, Home], [/^#\/curso\/([\w-]+)$/, Course], [/^#\/leccion\/([\w-]+)$/, Lesson], [/^#\/proyectos$/, Projects], [/^#\/laboratorio(?:\/([\w-]+))?$/, Lab], [/^#\/progreso$/, Progress]];
function route() {
  WS.length = 0; App.lesson = null;
  const view = $('#view'), hash = location.hash || '#/'; view.replaceChildren();
  const hit = routes.map(([re, fn]) => [hash.match(re), fn]).find(([m]) => m);
  if (hit) hit[1](view, ...hit[0].slice(1)); else view.innerHTML = '<p>No encontré esa página. <a href="#/">Volver al inicio</a></p>';
  window.scrollTo(0, 0);
}
Store.load();
addEventListener('hashchange', route);
setInterval(() => { if (document.hidden) return; Store.d.seconds += 5; if (App.lesson) { const s = Store.lesson(App.lesson); s.sec = (s.sec || 0) + 5; } Store.save(); }, 5000);
route();
