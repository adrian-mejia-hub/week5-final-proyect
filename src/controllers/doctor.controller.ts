import { Request, Response } from "express"
import * as doctorModel from "../models/doctor.model.js"
import * as appointmentModel from "../models/appointment.model.js"

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    // Acepta ?specialty= o ?especialidad=
    const specialty = (req.query.specialty || req.query.especialidad) as string | undefined

    const doctors = await doctorModel.getAllDoctors(specialty)
    res.json(doctors)
  } catch (error) {
    console.error("Error al obtener médicos:", error)
    res.status(500).json({ error: "Error interno del servidor al obtener el directorio de médicos" })
  }
}

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ error: "El ID proporcionado no es un número válido" })
      return
    }

    const doctor = await doctorModel.getDoctorById(id)
    if (!doctor) {
      res.status(404).json({ error: "Médico no encontrado" })
      return
    }

    res.json(doctor)
  } catch (error) {
    console.error("Error al obtener médico por ID:", error)
    res.status(500).json({ error: "Error interno del servidor al consultar el médico" })
  }
}

// Agenda del médico por rango de fechas (Parte 2)
export const getAgenda = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorId = Number(req.params.id)
    if (isNaN(doctorId) || doctorId <= 0) {
      res.status(400).json({ error: "El ID del médico proporcionado no es válido" })
      return
    }

    // Verificar existencia del médico
    const doctor = await doctorModel.getDoctorById(doctorId)
    if (!doctor) {
      res.status(404).json({ error: "Médico no encontrado" })
      return
    }

    const { from, to } = req.query
    let fromDate: Date | undefined = undefined
    let toDate: Date | undefined = undefined

    // Solo si ambos llegan, convertirlos a Date
    if (from && to) {
      fromDate = new Date(from as string)
      toDate = new Date(to as string)

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        res.status(400).json({ error: "Las fechas 'from' y 'to' deben tener un formato válido" })
        return
      }
    }

    const agenda = await appointmentModel.getDoctorAgenda(doctorId, fromDate, toDate)
    res.json(agenda)
  } catch (error) {
    console.error("Error al consultar la agenda del médico:", error)
    res.status(500).json({ error: "Error interno del servidor al obtener la agenda" })
  }
}
