import { Request, Response } from "express"
import * as appointmentModel from "../models/appointment.model.js"
import * as patientModel from "../models/patient.model.js"
import * as doctorModel from "../models/doctor.model.js"
import { appointmentStatusSchema } from "../middlewares/validate-appointment.js"

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pacienteId, medicoId, fechaHora, motivo } = req.body

    // 1. Confirmar que el paciente existe
    const patient = await patientModel.getPatientById(pacienteId)
    if (!patient) {
      res.status(404).json({ message: "Paciente no encontrado" })
      return
    }

    // 2. Confirmar que el médico existe
    const doctor = await doctorModel.getDoctorById(medicoId)
    if (!doctor) {
      res.status(404).json({ message: "Médico no encontrado" })
      return
    }

    // 3. Crear la cita con estado inicial 'PROGRAMADA'
    const appointment = await appointmentModel.createAppointment({
      pacienteId,
      medicoId,
      fechaHora,
      motivo
    })

    res.status(201).json(appointment)
  } catch (error) {
    console.error("Error al agendar cita:", error)
    res.status(500).json({ message: "Error interno del servidor al agendar la cita" })
  }
}

// Actualizar el estado de una cita (Parte 3)
export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ error: "El ID de la cita no es válido" })
      return
    }

    // Validar el body con appointmentStatusSchema
    const validation = appointmentStatusSchema.safeParse(req.body)
    if (!validation.success) {
      res.status(400).json({
        error: "Estado de cita inválido",
        detalles: validation.error.issues.map((i) => i.message)
      })
      return
    }

    const updated = await appointmentModel.updateAppointmentStatus(id, validation.data)
    res.json(updated)
  } catch (error: any) {
    // Si el id no existe, Prisma lanza error de código P2025
    if (error?.code === "P2025") {
      res.status(404).json({ error: "Cita no encontrada" })
      return
    }
    console.error("Error al actualizar estado de la cita:", error)
    res.status(500).json({ error: "Error interno del servidor al actualizar la cita" })
  }
}
