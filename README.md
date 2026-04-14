# Sistema de Gestión de Citas Médicas - UNPHU 🏥

¡Bienvenido al **Sistema de Gestión de Citas Médicas UNPHU**! Esta es una plataforma integral diseñada para optimizar la administración de pacientes, médicos y citas médicas de manera eficiente y moderna.

El sistema cuenta con una arquitectura robusta, una interfaz de usuario premium y seguridad avanzada mediante JWT.

## ✨ Características Principales

*   **Módulo de Médicos**: Gestión completa de personal médico vinculado a cuentas de usuario.
*   **Módulo de Pacientes**: Registro y administración detallada de pacientes.
*   **Gestión de Citas**: Proceso completo de creación, edición y seguimiento de citas médicas.
*   **Recepción y Despacho**: Panel operativo para la gestión en tiempo real del flujo de pacientes y estados de cita.
*   **Seguridad Proactiva**: Sistema de protección contra sesiones expiradas y middleware de autenticación (JWT).
*   **Interfaz Moderna**: Diseño limpio, responsivo y profesional basado en las mejores prácticas de UX/UI.

---

## 🚀 Guía de Instalación y Uso

### 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:
1.  **Node.js** (Versión 16 o superior recomendada).
2.  **Angular CLI** (`npm install -g @angular/cli`).
3.  **Servidor Web (XAMPP/WAMP)**: El backend requiere de PHP y MySQL.

### 📥 Clonación del Proyecto

1.  Abre tu terminal y clona el repositorio:
    ```bash
    git clone [URL-DEL-REPOSITORIO]
    ```
2.  Entra en la carpeta del proyecto:
    ```bash
    cd citas-medicas-unphu
    ```
3.  Instala las dependencias necesarias:
    ```bash
    npm install
    ```

### ⚙️ Configuración del Backend

El sistema depende de una API en PHP. Asegúrate de que los archivos del backend estén ubicados en:
`C:\xampp\htdocs\projects\citas_medicas`

Verifica que tu base de datos MySQL esté corriendo y que la base de datos `citas_medicas` esté importada.

### 🏃 Ejecución del Sistema

Para iniciar el servidor de desarrollo de Angular, ejecuta:
```bash
npm start
```
O simplemente:
```bash
ng serve
```

Una vez iniciado, abre tu navegador en: `http://localhost:4200`

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend**: Angular 16+, TypeScript, Bootstrap 5.
*   **Backend**: PHP (REST API).
*   **Base de Datos**: MySQL.
*   **Estilos**: CSS3 Moderno con Glassmorphism y animaciones personalizadas.
*   **Librerías**: SweetAlert2, FontAwesome, CryptoJS.

---

## ❤️ Feedback y Agradecimientos

Agradecemos enormemente tu interés en este sistema. Ha sido desarrollado con un enfoque centrado en el usuario para garantizar que la gestión médica sea lo más fluida posible.

Si tienes comentarios, sugerencias o encuentras algún problema, ¡no dudes en comunicarlo! Tu feedback es vital para seguir mejorando y ofreciendo la mejor experiencia tecnológica en el sector salud.

**¡Esperamos que disfrutes usando el sistema tanto como nosotros disfrutamos construyéndolo!** 🌟

---
*Desarrollado con ❤️ por [RixelDev](https://rixel.dev) con fines educativos para la UNPHU - Facultad de Ciencias y Tecnología.*
