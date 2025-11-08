SRS





CURSO: FUNDAMENTOS DE ALGORITMIA




PRESENTADO POR:  SEBASTIÁN SCHORTBORGH




ENTREGADO A: VICTOR FABIAN CASTRO PEREZ














UNIVERSIDAD DE CÓRDOBA.


FACULTAD DE EDUCACIÓN Y CIENCIAS HUMANAS.

LICENCIATURA EN INFORMÁTICA.

MONTERÍA – CÓRDOBA




 
Especificación de Requisitos de Software (SRS)
Proyecto: Calculadora de Notas

1. Introducción
1.1 Propósito
El propósito de este documento es definir y describir todos los requisitos funcionales, no funcionales y de interfaz para la aplicación “Calculadora de Notas”. Este sistema es una utilidad web del lado del cliente diseñada para ayudar a los estudiantes a calcular su rendimiento académico basándose en un esquema de ponderación de tres cortes (33%, 33%, 34%).
1.2 Alcance del Producto
La aplicación permitirá a los usuarios ingresar sus calificaciones de los dos primeros cortes (Corte 1 y Corte 2). Basado en estas entradas, el sistema calculará y mostrará:
•	La nota exacta que el usuario necesita obtener en el Corte 3 para alcanzar la nota de aprobación (3.0).
•	Mensajes contextuales que indiquen si la aprobación es imposible (requiere > 5.0) o si ya se ha logrado (requiere < 0.0).
•	Cálculos auxiliares que muestren la nota final máxima y mínima posible que el usuario puede obtener.
La aplicación está contenida en tres archivos (HTML, CSS, JS) y se ejecuta completamente en el navegador del cliente (client-side).
1.3 Definiciones y Acrónimos
SRS: Especificación de Requisitos de Software (Software Requirements Specification).
Corte: Período de evaluación académica (por ejemplo, “Corte 1”, “Corte 2”, “Corte 3”).
UI: Interfaz de Usuario (User Interface).
DOM: Modelo de Objetos del Documento (Document Object Model).
Nota de Aprobación: Calificación mínima para aprobar la materia, fijada en 3.0.
Nota Máxima: Calificación máxima posible, fijada en 5.0.
Nota Mínima: Calificación mínima posible, fijada en 0.0.

2. Descripción General
2.1 Perspectiva del Producto
Esta aplicación es una utilidad web independiente (standalone) que no requiere conectividad a bases de datos ni servicios de backend. Todo el procesamiento lógico y de validación se ejecuta en el navegador del usuario.
2.2 Funciones del Producto
El sistema proporcionará las siguientes funciones principales:
•	Inicialización de la interfaz con valores predeterminados.
•	Validación de entradas en tiempo real.
•	Validación de entradas al calcular.
•	Cálculo de la nota necesaria para aprobar.
•	Cálculo de escenarios máximo y mínimo.
•	Presentación clara de resultados con retroalimentación visual (colores).
2.3 Características de los Usuarios
Los usuarios objetivo de este sistema son principalmente estudiantes que necesitan calcular su rendimiento académico y planificar su calificación para el último corte. También puede ser utilizado por profesores para simular escenarios de calificación.
2.4 Restricciones
•	El esquema de ponderación está fijado y no es configurable:
o	Corte 1: 33% (0.33)
o	Corte 2: 33% (0.33)
o	Corte 3: 34% (0.34)
•	El rango de notas válido está entre 0.0 y 5.0.
•	La nota de aprobación está fijada en 3.0.
•	La aplicación debe funcionar en navegadores web modernos que soporten HTML5, CSS3 y JavaScript (ES6+).

3. Requisitos Específicos
3.1 Requisitos Funcionales (RF)
RF-01: Inicialización de la Aplicación
Al cargar la página (evento DOMContentLoaded), el sistema debe inicializar los campos de entrada para el Corte 1 y el Corte 2 con el valor “0.0”.
Razón: Evitar que los campos se consideren vacíos al cargar la página por primera vez y proporcionar un punto de partida claro.
RF-02: Validación de Entradas en Tiempo Real (mientras se escribe)
Mientras el usuario escribe en un campo de nota (evento oninput), el sistema debe validar el contenido.
Reglas:
•	Si el campo está vacío, no se muestra ningún mensaje de error.
•	Si el valor ingresado (parseado con parseFloat) es NaN, menor que 0.0 o mayor que 5.0, se debe mostrar un mensaje de error.
•	Si el valor es válido (entre 0.0 y 5.0), cualquier error previo debe eliminarse.
RF-03: Validación de Entradas Estricta (al calcular)
Al presionar el botón “Calcular Nota Necesaria”, el sistema valida las entradas.
Si algún campo está vacío o fuera del rango permitido, se muestra un mensaje de error y el cálculo se detiene.
Solo se continúa si ambos valores son válidos.
RF-04: Reseteo de Resultados
Antes de realizar un nuevo cálculo, el sistema debe limpiar los mensajes de error y restablecer los resultados a sus valores por defecto (“0.00”).
RF-05: Cálculo de Nota Necesaria para Aprobar
El sistema debe calcular la nota requerida en el Corte 3 para alcanzar una nota final de 3.0.
Fórmulas:
pesoAcumulado = (n1 * 0.33) + (n2 * 0.33)
notaRequeridaPara3 = 3.0 - pesoAcumulado
notaNecesaria = notaRequeridaPara3 / 0.34
RF-06: Presentación del Resultado de Nota Necesaria
El sistema mostrará la nota necesaria con dos decimales y aplicará lógica visual según el caso:
•	Caso imposible: notaNecesaria > 5.0 → Mostrar mensaje “¡Imposible!” en color de peligro.
•	Caso aprobado: notaNecesaria < 0.0 → Mostrar “0.00” y mensaje “¡Ya aprobaste!” en color de éxito.
•	Caso normal: Mostrar el valor calculado (0.0 ≤ nota ≤ 5.0) en color primario.
RF-07: Cálculo de Nota Final Máxima
El sistema calculará la nota final máxima posible si el usuario obtiene 5.0 en el Corte 3:
notaFinalMaxima = pesoAcumulado + (5.0 * 0.34)
Debe mostrarse con dos decimales.
RF-08: Cálculo de Nota Final Mínima
El sistema calculará la nota mínima posible si el usuario obtiene 0.0 en el Corte 3:
notaFinalMinima = pesoAcumulado + (0.0 * 0.34)
Debe mostrarse con dos decimales.

3.2 Requisitos No Funcionales (RNF)
RNF-01: Estética (Look and Feel)
•	Interfaz limpia, moderna y profesional con la fuente Poppins.
•	Fondo con gradiente: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%).
•	Paleta de colores definida con variables CSS: --primary-color, --secondary-color, --danger-color.
•	Contenido principal dentro de una tarjeta con bordes redondeados y sombra.
RNF-02: Usabilidad y Retroalimentación
•	Interfaz intuitiva con etiquetas claras.
•	Retroalimentación inmediata al escribir.
•	Botones con efecto hover.
•	Resultados visualmente diferenciados de las entradas.
RNF-03: Rendimiento
Todos los cálculos y validaciones deben ejecutarse de manera instantánea, sin retrasos perceptibles.
RNF-04: Compatibilidad
Debe funcionar correctamente en las versiones más recientes de Chrome, Firefox, Safari y Edge (tanto escritorio como móvil).
RNF-05: Mantenibilidad
•	Código JavaScript separado del HTML.
•	Uso de constantes para pesos y valores fijos.
•	Nombres descriptivos en variables y funciones.

3.3 Requisitos de Interfaz de Usuario (UI)
UI-01: Contenedor Principal (.card-container)
Debe contener toda la aplicación y tener un efecto transform: translateY(-5px) al pasar el ratón.
UI-02: Cabecera (<header>)
Debe mostrar el título “Calculadora de Notas” y el subtítulo con las ponderaciones “33% - 33% - 34%”.
UI-03: Sección de Entradas (.corte-inputs)
Debe incluir:
•	Etiquetas claras (“Nota Corte 1 (33%)”, “Nota Corte 2 (33%)”).
•	Campos de entrada (<input type="text">).
•	Contenedores para mensajes de error.
•	Botón principal “Calcular Nota Necesaria para 3.0”.
UI-04: Sección de Resultado Principal (.result-box)
Debe mostrar:
•	Título “Nota Necesaria en Corte 3 (34%)”.
•	Valor calculado (#notaNecesaria) en formato grande.
•	Mensaje contextual (#mensajeNecesaria).
UI-05: Sección de Cálculos Auxiliares
Debe incluir:
•	Línea divisoria (<hr>).
•	Título “Promedio General (Cálculos Auxiliares)”.
•	Nota final máxima (#notaFinalMaxima).
•	Nota final mínima (#notaFinalMinima).
