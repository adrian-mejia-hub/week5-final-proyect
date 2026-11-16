import { Request, Response, NextFunction } from "express"
import { z } from "zod"

export const appointmentSchema = z
  .object({
    // Nombres en español
    pacienteId: z.number().int().positive().optional(),
    medicoId: z.number().int().positive().optional(),
    fechaHora: z.coerce.date().min(new Date(), "No puedes agendar una cita en una fecha que ya pasó").optional(),
    motivo: z.string().optional(),

    // Nombres del ejemplo de la guía
    patientId: z.number().int().positive().optional(),
    doctorId: z.number().int().positive().optional(),
    scheduledAt: z.coerce.date().min(new Date(), "No puedes agendar una cita en una fecha que ya pasó").optional(),
    reason: z.string().optional()
  })
  .refine(
    (data) => data.pacienteId !== undefined || data.patientId !== undefined,
    {
      message: "El ID del paciente es obligatorio y debe ser un entero positivo",
      path: ["pacienteId"]
    }
  )
  .refine(
    (data) => data.medicoId !== undefined || data.doctorId !== undefined,
    {
      message: "El ID del médico es obligatorio y debe ser un entero positivo",
      path: ["medicoId"]
    }
  )
  .refine(
    (data) => data.fechaHora !== undefined || data.scheduledAt !== undefined,
    {
      message: "La fecha y hora de la cita es obligatoria y no puede ser en el pasado",
      path: ["fechaHora"]
    }
  )
  .transform((data) => ({
    pacienteId: (data.pacienteId ?? data.patientId)!,
    medicoId: (data.medicoId ?? data.doctorId)!,
    fechaHora: (data.fechaHora ?? data.scheduledAt)!,
    motivo: data.motivo ?? data.reason
  }))

export const validateAppointment = (req: Request, res: Response, next: NextFunction): void => {
  const result = appointmentSchema.safeParse(req.body)

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      campo: issue.path.join("."),
      mensaje: issue.message
    }))
    res.status(400).json({
      error: "Datos de cita inválidos",
      detalles: errors
    })
    return
  }

  req.body = result.data
  next()
}

// Schema de validación para actualización de estado de cita (Parte 3)
export const appointmentStatusSchema = z
  .object({
    status: z.enum(["COMPLETADA", "CANCELADA"]).optional(),
    estado: z.enum(["COMPLETADA", "CANCELADA"]).optional()
  })
  .refine((data) => data.status !== undefined || data.estado !== undefined, {
    message: "El estado de la cita debe ser 'COMPLETADA' o 'CANCELADA'",
    path: ["status"]
  })
  .transform((data) => (data.status || data.estado) as "COMPLETADA" | "CANCELADA")
