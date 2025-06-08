# Tarea 4: Web Components

Este proyecto contiene implementaciones de Web Components utilizando tanto los estándares nativos (Custom Elements, Shadow DOM, HTML Templates) como la biblioteca Lit Element.

## Componentes Implementados

Se han desarrollado dos componentes, cada uno implementado de dos formas diferentes:

### 1. Componente de Suscripción

Un componente para mostrar planes de suscripción con diferentes características y precios.

- **Implementación Estándar**: Utilizando Custom Elements, Shadow DOM y HTML Templates
- **Implementación con Lit**: Utilizando Lit Element y lit-html

### 2. Componente de Acordión

Un componente para mostrar información en secciones plegables que se pueden abrir y cerrar.

- **Implementación Estándar**: Utilizando Custom Elements, Shadow DOM y HTML Templates
- **Implementación con Lit**: Utilizando Lit Element y lit-html

## Estructura del Proyecto

```
├── index.html                  # Página principal con enlaces a las demos
├── components/                 # Directorio de componentes
│   ├── standard/               # Implementaciones estándar
│   │   ├── suscripcion.js      # Componente de suscripción estándar
│   │   └── acordion.js         # Componente de acordión estándar
│   └── lit/                    # Implementaciones con Lit
│       ├── suscripcion-lit.js  # Componente de suscripción con Lit
│       └── acordion-lit.js     # Componente de acordión con Lit
├── demos/                      # Páginas de demostración
│   ├── suscripcion-standard.html  # Demo del componente de suscripción estándar
│   ├── suscripcion-lit.html       # Demo del componente de suscripción con Lit
│   ├── acordion-standard.html     # Demo del componente de acordión estándar
│   └── acordion-lit.html          # Demo del componente de acordión con Lit
└── styles/                     # Directorio de estilos CSS
    ├── main.css                # Estilos globales
    ├── index.css               # Estilos para la página principal
    ├── acordion-lit.css        # Estilos para el componente acordión (Lit)
    ├── acordion-standard.css   # Estilos para el componente acordión (Standard)
    ├── suscripcion-lit.css     # Estilos para el componente suscripción (Lit)
    ├── suscripcion-standard.css # Estilos para el componente suscripción (Standard)
    ├── acordion-lit-demo.css   # Estilos para la demo del acordión (Lit)
    ├── acordion-standard-demo.css # Estilos para la demo del acordión (Standard)
    └── suscripcion-demo.css    # Estilos para las demos de suscripción
```

## Cómo Ejecutar las Demos

1. Clona este repositorio
2. Abre el archivo `index.html` en un navegador web (preferiblemente Chrome)
3. Navega a través de los enlaces para ver las diferentes demos

## Tecnologías Utilizadas

### Web Components Estándar

- **Custom Elements**: API para definir nuevos elementos HTML
- **Shadow DOM**: API para encapsular estilos y estructura
- **HTML Templates**: Elementos HTML que no se renderizan pero pueden ser instanciados

### Lit Element

- **Lit Element**: Biblioteca ligera para crear Web Components
- **lit-html**: Motor de plantillas eficiente para JavaScript

## Características de los Componentes

### Componente de Suscripción

- Muestra planes de suscripción con título, precio y características
- Permite destacar un plan como "destacado"
- Emite eventos cuando se selecciona un plan
- Personalizable a través de atributos y slots
- Muestra detalles del plan seleccionado de forma permanente
- Resalta visualmente el plan seleccionado
- Incluye un botón de confirmación para finalizar la selección

### Componente de Acordión

- Muestra secciones plegables que se pueden abrir y cerrar
- Opción para permitir múltiples secciones abiertas o solo una
- API programática para controlar las secciones (abrir, cerrar)
- Emite eventos cuando cambia el estado de una sección
- Puede mostrar información de suscripciones con título, descripción y precio

## Lógica de Programación de los Componentes

### Componente de Suscripción

#### Eventos y Manejo

El componente de suscripción emite un evento personalizado `suscripcion-selected` cuando se hace clic en el botón de suscripción. Este evento incluye detalles sobre el plan seleccionado:

```javascript
// Escuchar el evento de selección de suscripción
document.addEventListener('suscripcion-selected', (event) => {
    console.log(`Plan seleccionado: ${event.detail.title} - ${event.detail.price}`);
    // Realizar acciones con la selección, como:
    // - Mostrar una notificación
    // - Redirigir a una página de pago
    // - Actualizar el estado de la aplicación
});
```

El objeto `event.detail` contiene:
- `title`: El título del plan seleccionado
- `price`: El precio del plan seleccionado

#### Ejemplo de Notificación

Para mostrar una notificación cuando se selecciona un plan:

```javascript
document.addEventListener('suscripcion-selected', (event) => {
    const notification = document.getElementById('notification');
    const planInfo = document.getElementById('plan-info');

    planInfo.textContent = `${event.detail.title} - ${event.detail.price}`;
    notification.classList.add('show');

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
});
```

#### Detalles del Plan Seleccionado

El componente también permite mostrar los detalles del plan seleccionado de forma permanente y resaltar visualmente el plan seleccionado:

```javascript
document.addEventListener('suscripcion-selected', (event) => {
    // Actualizar la sección de detalles del plan
    const planDetailsSection = document.getElementById('plan-details-section');
    const selectedPlanTitle = document.getElementById('selected-plan-title');
    const selectedPlanPrice = document.getElementById('selected-plan-price');
    const selectedPlanPeriod = document.getElementById('selected-plan-period');

    // Encontrar el componente que fue seleccionado
    const components = document.querySelectorAll('suscripcion-component'); // o 'suscripcion-lit'
    let selectedComponent = null;

    // Quitar la clase 'selected-plan' de todos los componentes
    components.forEach(component => {
        component.classList.remove('selected-plan');
    });

    // Encontrar y marcar el componente seleccionado
    components.forEach(component => {
        if (component.getAttribute('title') === event.detail.title && 
            component.getAttribute('price') === event.detail.price) {
            selectedComponent = component;
            component.classList.add('selected-plan');
        }
    });

    // Actualizar los detalles del plan
    selectedPlanTitle.textContent = event.detail.title;
    selectedPlanPrice.textContent = event.detail.price;

    // Obtener el periodo del componente
    if (selectedComponent) {
        selectedPlanPeriod.textContent = selectedComponent.getAttribute('period');
    }

    // Mostrar la sección de detalles del plan
    planDetailsSection.style.display = 'block';
});
```

#### Botón de Confirmación

Para agregar funcionalidad al botón de confirmación:

```javascript
const confirmButton = document.getElementById('confirm-plan-button');
confirmButton.onclick = function() {
    alert(`¡Has confirmado la selección del ${event.detail.title} por ${event.detail.price}!`);
};
```

### Componente de Acordión

#### Control Programático

El componente de acordión ofrece métodos para controlar las secciones programáticamente:

```javascript
const acordion = document.querySelector('acordion'); // o 'acordion-lit'

// Abrir una sección específica (índice basado en cero)
acordion.openItem(0); // Abre la primera sección

// Cerrar una sección específica
acordion.closeItem(1); // Cierra la segunda sección

// Abrir todas las secciones (solo funciona si single-open es false)
acordion.openAll();

// Cerrar todas las secciones
acordion.closeAll();
```

#### Eventos y Manejo

El componente emite un evento personalizado `acordion-toggle` cuando se abre o cierra una sección:

```javascript
document.addEventListener('acordion-toggle', (event) => {
    console.log(`Sección: ${event.detail.header}`);
    console.log(`Estado: ${event.detail.isOpen ? 'Abierto' : 'Cerrado'}`);

    // Realizar acciones basadas en el cambio de estado
});
```

El objeto `event.detail` contiene:
- `header`: El texto del encabezado de la sección
- `isOpen`: Un booleano que indica si la sección está abierta (true) o cerrada (false)
- `item`: Referencia al elemento DOM de la sección

#### Modo de Apertura Única (Lit)

En la versión Lit, se puede cambiar dinámicamente el modo de apertura única:

```javascript
const acordion = document.querySelector('acordion-lit');
const singleOpenToggle = document.getElementById('single-open-toggle');

// Cambiar el modo de apertura única
singleOpenToggle.addEventListener('change', () => {
    acordion.singleOpen = singleOpenToggle.checked;
});
```

#### Ejemplo de Notificación

Para mostrar una notificación cuando cambia el estado de una sección:

```javascript
function showNotification(message) {
    const notification = document.getElementById('notification');
    const actionInfo = document.getElementById('action-info');

    actionInfo.textContent = message;
    notification.classList.add('show');

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

document.addEventListener('acordion-toggle', (event) => {
    showNotification(`Sección "${event.detail.header}" ${event.detail.isOpen ? 'abierta' : 'cerrada'}`);
});
```

#### Mostrar Información de Suscripciones

El componente de acordión puede utilizarse para mostrar información de suscripciones de manera organizada:

```html
<acordion single-open="true">
    <!-- Plan Básico -->
    <div class="acordion-item" open="true">
        <div class="acordion-header">Plan Básico</div>
        <div class="acordion-content">
            <div class="suscripcion-description">
                <p>Descripción del plan básico...</p>
                <ul class="feature-list">
                    <li class="feature-item">✓ Característica 1</li>
                    <li class="feature-item">✓ Característica 2</li>
                    <li class="feature-item">✗ Característica 3</li>
                </ul>
            </div>
            <div class="suscripcion-price">
                <p class="price">$9.99</p>
                <p class="period">por mes</p>
            </div>
        </div>
    </div>

    <!-- Más planes... -->
</acordion>
```

Esta estructura muestra la información de suscripción en el orden solicitado:
1. Título del plan (en el encabezado del acordeón)
2. Descripción y características (en el contenido del acordeón)
3. Precio (al final del contenido del acordeón)

Los estilos CSS correspondientes aseguran una presentación atractiva y coherente de la información.

## Comparación entre Implementaciones

### Ventajas de la Implementación Estándar

- No requiere dependencias externas
- Utiliza APIs nativas del navegador
- Mayor control sobre la implementación

### Ventajas de la Implementación con Lit

- Sintaxis más declarativa y concisa
- Sistema de propiedades reactivo
- Renderizado eficiente que solo actualiza lo que cambia
- Mejor manejo de eventos con decoradores (@click)
- Tipado de propiedades

## Autor

Grupo 9 - Tarea 4
Curso: Diseño de Aplicaciones Web y Móviles
Semestre: 2025-1
