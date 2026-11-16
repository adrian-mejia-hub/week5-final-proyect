import prisma from "../src/config/prisma.js"
import { Role, EstadoCita } from "../generated/prisma/client.js"

async function main() {
  console.log("Iniciando seed de datos...")

  // Limpiar datos existentes respetando llaves foráneas
  await prisma.cita.deleteMany()
  await prisma.medico.deleteMany()
  await prisma.especialidad.deleteMany()
  await prisma.paciente.deleteMany()
  await prisma.user.deleteMany()

  // 1. Crear Especialidades (mínimo 3)
  const cardiologia = await prisma.especialidad.create({
    data: {
      nombre: "Cardiología",
      descripcion: "Diagnóstico y tratamiento de enfermedades del corazón y aparato circulatorio."
    }
  })

  const pediatria = await prisma.especialidad.create({
    data: {
      nombre: "Pediatría",
      descripcion: "Atención médica integral de bebés, niños y adolescentes."
    }
  })

  const medicinaGeneral = await prisma.especialidad.create({
    data: {
      nombre: "Medicina General",
      descripcion: "Atención primaria, prevención y diagnóstico inicial."
    }
  })

  const dermatologia = await prisma.especialidad.create({
    data: {
      nombre: "Dermatología",
      descripcion: "Cuidado de la piel, cabello y uñas."
    }
  })

  console.log("Especialidades creadas correctamente.")

  // 2. Crear Médicos (al menos 2 por especialidad)
  // Cardiología
  await prisma.medico.createMany({
    data: [
      {
        nombre: "Carlos",
        apellido: "Mendoza",
        email: "carlos.mendoza@clinica.com",
        telefono: "+503 7001-1111",
        especialidadId: cardiologia.id
      },
      {
        nombre: "Laura",
        apellido: "Gómez",
        email: "laura.gomez@clinica.com",
        telefono: "+503 7001-2222",
        especialidadId: cardiologia.id
      }
    ]
  })

  // Pediatría
  await prisma.medico.createMany({
    data: [
      {
        nombre: "Sofía",
        apellido: "Ramírez",
        email: "sofia.ramirez@clinica.com",
        telefono: "+503 7002-3333",
        especialidadId: pediatria.id
      },
      {
        nombre: "Andrés",
        apellido: "Castro",
        email: "andres.castro@clinica.com",
        telefono: "+503 7002-4444",
        especialidadId: pediatria.id
      }
    ]
  })

  // Medicina General
  await prisma.medico.createMany({
    data: [
      {
        nombre: "Elena",
        apellido: "Paredes",
        email: "elena.paredes@clinica.com",
        telefono: "+503 7003-5555",
        especialidadId: medicinaGeneral.id
      },
      {
        nombre: "Javier",
        apellido: "Morales",
        email: "javier.morales@clinica.com",
        telefono: "+503 7003-6666",
        especialidadId: medicinaGeneral.id
      }
    ]
  })

  console.log("Médicos creados correctamente (2 por especialidad).")

  // 3. Crear Usuarios de prueba para autenticación
  await prisma.user.createMany({
    data: [
      {
        email: "recepcion@clinica.com",
        password: "hashed_password_123",
        role: Role.RECEPCIONISTA
      },
      {
        email: "carlos.mendoza@clinica.com",
        password: "hashed_password_123",
        role: Role.MEDICO
      },
      {
        email: "gerencia@clinica.com",
        password: "hashed_password_123",
        role: Role.GERENCIA
      }
    ]
  })

  console.log("Usuarios base creados correctamente.")

  // 4. Crear Pacientes de prueba
  const paciente1 = await prisma.paciente.create({
    data: {
      nombre: "Juan",
      apellido: "Pérez",
      email: "juan.perez@example.com",
      telefono: "+503 7888-9999",
      fechaNacimiento: new Date("1990-05-15")
    }
  })

  const paciente2 = await prisma.paciente.create({
    data: {
      nombre: "María",
      apellido: "López",
      email: "maria.lopez@example.com",
      telefono: "+503 7999-8888",
      fechaNacimiento: new Date("1985-11-20")
    }
  })

  console.log("Pacientes de prueba creados.")

  // 5. Crear Citas de prueba
  const medicoCardio = await prisma.medico.findFirst({
    where: { especialidadId: cardiologia.id }
  })

  if (medicoCardio) {
    const fechaFutura = new Date()
    fechaFutura.setDate(fechaFutura.getDate() + 3)

    await prisma.cita.create({
      data: {
        pacienteId: paciente1.id,
        medicoId: medicoCardio.id,
        fechaHora: fechaFutura,
        estado: EstadoCita.PROGRAMADA,
        motivo: "Chequeo de rutina cardiovascular"
      }
    })
    console.log("Cita de prueba agendada.")
  }

  console.log("¡Seed completado exitosamente!")
}

main()
  .catch((e) => {
    console.error("Error ejecutando el seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
