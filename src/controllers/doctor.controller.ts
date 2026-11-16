import { Request, Response } from "express"
import * as doctorModel from "../models/doctor.model.js"

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
