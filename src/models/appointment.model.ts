import prisma from "../config/prisma.js"

export interface CreateAppointmentData {
  pacienteId: number
  medicoId: number
  fechaHora: Date
  motivo?: string
}

export const createAppointment = async (data: CreateAppointmentData) => {
  return await prisma.cita.create({
    data: {
      pacienteId: data.pacienteId,
      medicoId: data.medicoId,
      fechaHora: data.fechaHora,
      motivo: data.motivo
      // El estado 'PROGRAMADA' se asigna por defecto desde Prisma schema
    },
    include: {
      paciente: true,
      medico: {
        include: {
          especialidad: true
        }
      }
    }
  })
}

// Agenda del médico por rango de fechas (Parte 2)
export const getDoctorAgenda = async (doctorId: number, from?: Date, to?: Date) => {
  return await prisma.cita.findMany({
    where: {
      medicoId: doctorId,
      ...(from && to ? { fechaHora: { gte: from, lte: to } } : {})
    },
    include: {
      paciente: true
    },
    orderBy: {
      fechaHora: "asc"
    }
  })
}

// Actualizar el estado de una cita (Parte 3)
export const updateAppointmentStatus = async (id: number, status: "COMPLETADA" | "CANCELADA") => {
  return await prisma.cita.update({
    where: { id },
    data: { estado: status },
    include: {
      paciente: true,
      medico: {
        include: {
          especialidad: true
        }
      }
    }
  })
}
