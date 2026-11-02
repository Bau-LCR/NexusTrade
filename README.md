# Academia Web

Plataforma local para aprender HTML, CSS, JavaScript y PHP escribiendo código real: cursos por módulos, editor con pestañas, vista previa, consola, corrección con explicaciones, pistas progresivas, evaluaciones, proyectos y progreso guardado en tu navegador.

## Cómo iniciarla

1. Instalá PHP 8 o superior (https://www.php.net/downloads) y comprobá que `php -v` funcione.
2. Ejecutá `start.sh` (macOS/Linux) o `start.bat` (Windows). Equivale a `php -S 127.0.0.1:8000`.
3. Abrí http://127.0.0.1:8000

HTML, CSS y JavaScript corren en el navegador. PHP se ejecuta de verdad: `php/run.php` lanza un proceso `php` local con el código del editor. Si abrís `index.html` con doble clic todo funciona menos PHP (el indicador de la esquina lo avisa).

## Estructura

- `index.html`, `css/styles.css`: interfaz.
- `js/app.js`: motor (editor, ejecución, corrección, progreso, rutas).
- `js/content.js`: **todo el contenido** (cursos, clases, ejercicios, proyectos).
- `php/run.php`: ejecutor de PHP. `php/sandbox/`: carpeta temporal donde corre tu código.
- `vendor/codemirror/`: CodeMirror 5 incluido (sin CDN, funciona sin internet).

## Agregar clases

Una clase es un objeto dentro de `COURSES` (ver la clase modelo de cada curso): `theory`, `example`, `mistakes`, `exercises`, `challenge` y `quiz`. Cada ejercicio define `checks`: `t` es una expresión JavaScript que recibe `doc` (la página renderizada), `code` (lo que escribiste) y `logs`; en PHP recibe `out`, `err` y `code`. `m` es la explicación que ves cuando falla. Una clase se da por completada al resolver todos los ejercicios, el desafío y sacar 60 % o más en la evaluación.

## Seguridad

`run.php` solo responde a 127.0.0.1, limita la ejecución a 5 s, restringe archivos a `php/sandbox/` (`open_basedir`) y desactiva `exec`, `system`, etc. Es para uso personal: no lo subas a un servidor público.

## Copia de seguridad

«Mi progreso» → Exportar / Importar (archivo JSON). El progreso vive en el `localStorage` del navegador y de la dirección `127.0.0.1:8000`: usá siempre la misma.

## GitHub

`git init && git add . && git commit -m "Academia Web"`. El `.gitignore` ya excluye los archivos temporales de `php/sandbox/`.
