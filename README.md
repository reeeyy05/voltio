# ⚡ Voltio

**Voltio** es una solución digital integral diseñada específicamente para optimizar la gestión operativa en el sector de la electricidad. Esta aplicación web técnica centraliza el control de las obras activas, permitiendo a los administradores y jefes de obra mantener un registro preciso y en tiempo real de cada proyecto.

---

## 🚀 Objetivos del Proyecto
El objetivo principal de **Voltio** es eliminar la dispersión de información y el uso de herramientas no especializadas. Ofrece un entorno unificado donde la gestión de recursos y el progreso de la obra convergen en una sola interfaz técnica y eficiente.

## ✨ Funcionalidades Clave
* **🏗️ Gestión de Obras y Tareas:** El núcleo de la aplicación permite crear, visualizar, actualizar y finalizar proyectos eléctricos, así como asignar tareas específicas a los operarios (con estados "Pendiente" o "Finalizada").
* **📦 Control de Inventario y Materiales:** Registro detallado del stock general de la empresa, permitiendo modificaciones manuales instantáneas o **carga masiva de materiales mediante archivos CSV**.
* **👥 Gestión de Usuarios y Accesos:** Panel de administración avanzado para modificar datos del personal, promover o degradar roles y visualizar la carga de trabajo global del equipo mediante gráficos interactivos.

---

## 🛠️ Stack Tecnológico
Para garantizar escalabilidad, velocidad y una experiencia de usuario fluida, el proyecto utiliza:

* **Frontend:** [React.js](https://reactjs.org/) + Vite
* **Gestión de Estado:** Zustand (Arquitectura modular por *stores*)
* **Diseño y Estilos:** TailwindCSS + Shadcn UI
* **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Auth & Storage)
* **Despliegue**: Vercel

---

## 👤 Roles de Usuario

El sistema se ha optimizado para manejar dos perfiles fundamentales, garantizando la seguridad mediante políticas de acceso (RLS):

| Rol | Descripción | Funcionalidades |
| :--- | :--- | :--- |
| **⚡ Administrador** | Gestiona toda la aplicación: configura, añade o elimina funcionalidades, usuarios y datos. | <ul><li>Acceso CRUD total a toda la aplicación</li><li>Crear obras y asignar tareas</li><li>Gestión de roles y datos de empleados</li><li>Visualizar gráficos del *dashboard* global</li><li>Realizar cargas masivas (CSV) en inventario</li></ul> |
| **👷 Empleado** | Realiza tareas asignadas y gestiona materiales operativos; solo accede a sus propios proyectos. | <ul><li>Consultar tareas y obras asignadas</li><li>Actualizar estado de tareas propias a "Finalizada"</li><li>Visualizar y modificar stock en el inventario general</li><li>Ver progreso personal en el *dashboard*</li></ul> |

---

## 📅 Cronograma de Desarrollo
Planificación estratégica basada en hitos clave:

| Fecha | Hito de Desarrollo |
| :--- | :--- |
| **12-Sept** | Presentación de Asignatura y Proyecto |
| **19-Sept** | Creación de Imagen Corporativa |
| **26-Sept** | Recogida de Necesidades y Elaboración de Contrato |
| **03-Oct** | Definición de Requisitos Funcionales y No Funcionales |
| **10-Oct** | Desarrollo de las Interfaces Gráficas |
| **17-Oct** | Desarrollo de la Estructura de la Base de Datos |
| **24-Oct** | Definición de **Modelo Relacional de la Base de Datos** |
| **31-Oct** | Presentación de Interfaces y BD a la Empresa |
| **07-Nov** | Elección de Tecnologías (React & Supabase) |
| **12-Dic** | Evaluación de Opciones de Despliegue |
| **19-Dic** | Pruebas de Despliegue en Entorno Local (TomCat) |
| **09-Ene** | Pruebas de Despliegue en **Vercel** |
| **16-Ene** | Creación **README** de presentación |
| **23-Ene** | Preparación para el futuro sobre el **Manual de Usuario** |
| **30-Ene** | Preparación para el futuro sobre el **Manual Técnico** |
| **6-Feb** | Manual de Despliegue |
| **27-Feb** | Implementación de Carga Masiva (CSV) en Inventario |
| **15-Mar** | Configuración de Gráficos (Recharts) en Dashboard |
| **10-Abr** | Refactorización de Estado Global (Zustand) y persistencia (F5) |
| **05-May** | Auditoría y ajuste de Políticas RLS de Supabase |
| **23-May** | Redacción Final del **Manual Técnico** y revisión de código |

---
Participante: Alejandro Rey Tostado  
Centro: IES Albarregas, Mérida
