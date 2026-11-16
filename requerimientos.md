# Levantamiento de Requerimientos — Clínica "Salud Integral"

Documento de análisis y modelado de datos correspondiente a la **Parte 1** del proyecto para la Clínica "Salud Integral".

---

## 1. Entidades Principales

A partir del análisis del caso de negocio (módulos de Recepción, Consultorio y Gerencia), se detectaron las siguientes entidades principales del dominio:

1. **Paciente (`pacientes`):** Representa a las personas que reciben atención en la clínica. Se captura su información personal, de contacto y fecha de nacimiento.
2. **Especialidad (`especialidades`):** Representa las áreas médicas de la clínica (e.g., Cardiología, Pediatría, Medicina General). Se modela como una entidad independiente para cumplir con la normalización de datos, permitiendo listar especialidades existentes incluso si aún no tienen médicos asignados, y facilitar los reportes de gerencia por área.
3. **Médico (`medicos`):** Representa a los profesionales de la salud que atienden en la clínica y pertenecen a una especialidad médica determinada.
4. **Cita (`citas`):** Representa el evento de atención médica agendado entre un paciente y un médico específico en una fecha y hora determinadas, con un ciclo de vida definido por sus estados.

*(Nota: Las cuentas de usuario y autenticación corresponden a un requisito técnico que se integrará según las especificaciones de la Parte 3).*

---

## 2. Atributos de Cada Entidad

### 2.1. Entidad: `Paciente`

| Atributo | Tipo de Dato Aproximado | Notas | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `INT` / `SERIAL` | `[PK]`, `Obligatorio` | Identificador único del paciente. |
| `nombre` | `VARCHAR(100)` | `Obligatorio` | Nombre(s) del paciente. |
| `apellido` | `VARCHAR(100)` | `Obligatorio` | Apellido(s) del paciente. |
| `email` | `VARCHAR(150)` | `Único`, `Obligatorio` | Correo electrónico válido (formato validado). |
| `telefono` | `VARCHAR(20)` | `Opcional` | Teléfono de contacto. |
| `fecha_nacimiento` | `DATE` | `Obligatorio` | Fecha de nacimiento (debe ser menor a la fecha actual). |
| `fecha_registro` | `TIMESTAMP` | `Obligatorio` | Fecha y hora en la que se dio de alta en el sistema. |

---

### 2.2. Entidad: `Especialidad`

| Atributo | Tipo de Dato Aproximado | Notas | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `INT` / `SERIAL` | `[PK]`, `Obligatorio` | Identificador único de la especialidad. |
| `nombre` | `VARCHAR(100)` | `Único`, `Obligatorio` | Nombre de la especialidad médica (ej. Cardiología, Pediatría). |
| `descripcion` | `TEXT` | `Opcional` | Breve descripción de los servicios o alcance del área médica. |

---

### 2.3. Entidad: `Médico`

| Atributo | Tipo de Dato Aproximado | Notas | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `INT` / `SERIAL` | `[PK]`, `Obligatorio` | Identificador único del médico. |
| `nombre` | `VARCHAR(100)` | `Obligatorio` | Nombre(s) del médico. |
| `apellido` | `VARCHAR(100)` | `Obligatorio` | Apellido(s) del médico. |
| `email` | `VARCHAR(150)` | `Único`, `Obligatorio` | Correo electrónico profesional. |
| `telefono` | `VARCHAR(20)` | `Opcional` | Teléfono de contacto o consultorio. |
| `especialidad_id` | `INT` | `[FK]`, `Obligatorio` | Llave foránea hacia la tabla `especialidades`. |
| `fecha_registro` | `TIMESTAMP` | `Obligatorio` | Fecha y hora de alta del médico. |

---

### 2.4. Entidad: `Cita`

| Atributo | Tipo de Dato Aproximado | Notas | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `INT` / `SERIAL` | `[PK]`, `Obligatorio` | Identificador único de la cita médica. |
| `paciente_id` | `INT` | `[FK]`, `Obligatorio` | Llave foránea que referencia al paciente agendado. |
| `medico_id` | `INT` | `[FK]`, `Obligatorio` | Llave foránea que referencia al médico asignado. |
| `fecha_hora` | `TIMESTAMP` | `Obligatorio` | Fecha y hora de la cita (debe ser posterior a la fecha actual al crearse). |
| `estado` | `VARCHAR(20)` / `ENUM` | `Obligatorio` | Estado de la cita: `'Programada'`, `'Completada'` o `'Cancelada'`. Valor por defecto: `'Programada'`. |
| `motivo` | `TEXT` | `Opcional` | Razón de la consulta o notas clínicas iniciales. |
| `created_at` | `TIMESTAMP` | `Obligatorio` | Fecha y hora en que se agendó la cita. |
| `updated_at` | `TIMESTAMP` | `Opcional` | Fecha y hora de la última actualización (cambio de estado). |

---

## 3. Relaciones entre Entidades

Siguiendo el formato requerido:

1. **Especialidad — Médico:**
   > *"Una **Especialidad** puede tener muchos **Médicos**, pero un **Médico** pertenece a una sola **Especialidad**."*

2. **Paciente — Cita:**
   > *"Un **Paciente** puede tener muchas **Citas**, pero una **Cita** pertenece a un solo **Paciente**."*

3. **Médico — Cita:**
   > *"Un **Médico** puede tener muchas **Citas**, pero una **Cita** pertenece a un solo **Médico**."*

---

## 4. Reglas de Negocio Identificadas en el Caso

Para asegurar que el diseño soporte todas las necesidades descritas:

- **Módulo de Recepción:**
  - Validación de formato de correo electrónico al registrar pacientes.
  - Validación de fecha de nacimiento de pacientes (no se permiten fechas futuras).
  - Consulta de médicos filtrable por `especialidad_id`.
  - Expediente unificado del paciente con sus datos y su lista histórica de citas (`citas` filtradas por `paciente_id`).

- **Módulo de Consultorio:**
  - Bloqueo de creación de citas en fechas/horas pasadas (`fecha_hora >= CURRENT_TIMESTAMP`).
  - Filtrado de agenda de médicos por rango de fechas (`fecha_hora BETWEEN inicio AND fin` para un `medico_id`).
  - Las citas se inicializan con estado `'Programada'`.
  - Transición permitida de estados: `'Programada'` $\rightarrow$ `'Completada'` o `'Cancelada'`.

- **Módulo de Gerencia:**
  - **Rentabilidad por área:** Consulta de agregación que cuenta las citas agrupadas por especialidad médica (`COUNT(citas.id) GROUP BY especialidades.id`).
  - **Corte operativo diario:** Conteo de citas por estado (`Completada`, `Cancelada`) para una fecha dada (`DATE(fecha_hora) = fecha_seleccionada`).
