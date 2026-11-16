import { Request, Response, NextFunction } from "express"
import { z } from "zod"

// Esquema de validación con Zod
// Soporta tanto los nombres en español de nuestro modelo (nombre, apellido, fechaNacimiento)
// como los nombres del ejemplo de la guía (firstName, lastName, birthDate) para máxima compatibilidad.
export const patientSchema = z
  .object({
    // Campos en español
    nombre: z.string().min(1, "El nombre es obligatorio").optional(),
    apellido: z.string().min(1, "El apellido es obligatorio").optional(),
    fechaNacimiento: z.coerce.date().max(new Date(), "La fecha de nacimiento no puede ser futura").optional(),

    // Campos en inglés (del ejemplo de la guía)
    firstName: z.string().min(1, "El nombre es obligatorio").optional(),
    lastName: z.string().min(1, "El apellido es obligatorio").optional(),
    birthDate: z.coerce.date().max(new Date(), "La fecha de nacimiento no puede ser futura").optional(),

    // Campos comunes
    email: z.string().email("El correo no tiene un formato válido"),
    telefono: z.string().optional()
  })
  .refine(
    (data) => (data.nombre !== undefined && data.nombre.trim().length > 0) || (data.firstName !== undefined && data.firstName.trim().length > 0),
    {
      message: "El nombre es obligatorio",
      path: ["nombre"]
    }
  )
  .refine(
    (data) => (data.apellido !== undefined && data.apellido.trim().length > 0) || (data.lastName !== undefined && data.lastName.trim().length > 0),
    {
      message: "El apellido es obligatorio",
      path: ["apellido"]
    }
  )
  .refine(
    (data) => data.fechaNacimiento !== undefined || data.birthDate !== undefined,
    {
      message: "La fecha de nacimiento es obligatoria y no puede ser futura",
      path: ["fechaNacimiento"]
    }
  )
  .transform((data) => ({
    nombre: (data.nombre || data.firstName)!.trim(),
    apellido: (data.apellido || data.lastName)!.trim(),
    email: data.email.trim().toLowerCase(),
    telefono: data.telefono?.trim(),
    fechaNacimiento: (data.fechaNacimiento || data.birthDate)!
  }))

export const validatePatient = (req: Request, res: Response, next: NextFunction): void => {
  const result = patientSchema.safeParse(req.body)

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      campo: issue.path.join("."),
      mensaje: issue.message
    }))
    res.status(400).json({
      error: "Datos de paciente inválidos",
      detalles: errors
    })
    return
  }

  // Reemplazamos req.body con los datos validados y normalizados
  req.body = result.data
  next()
}
