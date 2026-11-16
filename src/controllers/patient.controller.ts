import { Request, Response } from "express"
import * as patientModel from "../models/patient.model.js"

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const newPatient = await patientModel.createPatient(req.body)
    res.status(201).json(newPatient)
  } catch (error: any) {
    if (error?.code === "P2002") {
      res.status(409).json({ error: "Ya existe un paciente registrado con ese correo electrónico" })
      return
    }
    console.error("Error al registrar paciente:", error)
    res.status(500).json({ error: "Error interno del servidor al crear el paciente" })
  }
}

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const patients = await patientModel.getAllPatients()
    res.json(patients)
  } catch (error) {
    console.error("Error al obtener pacientes:", error)
    res.status(500).json({ error: "Error interno del servidor al obtener los pacientes" })
  }
}

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id)
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ error: "El ID proporcionado no es un número válido" })
      return
    }

    const patient = await patientModel.getPatientById(id)
    if (!patient) {
      res.status(404).json({ error: "Paciente no encontrado" })
      return
    }

    // Devolvemos el paciente con citas y el alias appointments para compatibilidad con la guía
    res.json({
      ...patient,
      appointments: patient.citas
    })
  } catch (error) {
    console.error("Error al consultar expediente de paciente por ID:", error)
    res.status(500).json({ error: "Error interno del servidor al buscar el paciente" })
  }
}
