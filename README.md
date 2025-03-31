# Testing

Este proyecto contiene pruebas end-to-end utilizando Playwright para verificar el funcionamiento de los proyectos Pokelist y Calendar.

📂 Estructura del Proyecto

test/ → Contiene los archivos de pruebas automatizadas.

Otros archivos y carpetas pueden agregarse según sea necesario.

🚀 Instalación

Clonar el repositorio:

git clone https://github.com/Jesusvcgit/testing.git
cd testing

Instalar dependencias:

npm install

Instalar Playwright y sus navegadores:

npx playwright install

🧪 Ejecución de Pruebas

Ejecutar todas las pruebas:

npx playwright test

Ejecutar pruebas específicas:

npx playwright test test/"archivo".spec.ts

📌 Pruebas Incluidas

🔹 Pokelist

Verifica que la aplicación carga correctamente.

Cambia de idioma y revisa que no haya errores en la consola.

Selecciona opciones de un <select> y valida su contenido.

Revisa que los elementos en la lista tengan imágenes.

Prueba la paginación y asegura que se muestren correctamente los datos.

Comprueba que los nombres de los elementos cambian según el idioma.

Valida que los modales se abran y cierren correctamente.

🔹 Calendar

Verifica la carga inicial de la aplicación.

Selecciona celdas en la tabla y comprueba que no haya errores en la consola.

Interactúa con los modales de edición y eliminación para validar su correcto funcionamiento.
