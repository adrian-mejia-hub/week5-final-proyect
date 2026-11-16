import prisma from "../config/prisma.js"

export interface CreatePatientData {
  nombre: string
  apellido: string
  email: string
  telefono?: string
  fechaNacimiento: Date
}

export const createPatient = async (data: CreatePatientData) => {
  return await prisma.paciente.create({
    data
  })
}

export const getAllPatients = async () => {
  return await prisma.paciente.findMany({
    orderBy: {
      id: "asc"
    }
  })
}

export const getPatientById = async (id: number) => {
  return await prisma.paciente.findUnique({
    where: {
      id
    }
  })
}
