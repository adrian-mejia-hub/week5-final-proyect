import "dotenv/config"
import express, { Request, Response } from "express"
import prisma from "./config/prisma.js"
import patientRoutes from "./routes/patient.routes.js"
import doctorRoutes from "./routes/doctor.routes.js"

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Rutas de Pacientes (Parte 2: /api/patients y alias /api/pacientes)
app.use("/api/patients", patientRoutes)
app.use("/api/pacientes", patientRoutes)

// Rutas de Médicos (Parte 3: /api/doctors y alias /api/medicos)
app.use("/api/doctors", doctorRoutes)
app.use("/api/medicos", doctorRoutes)

// Endpoint de salud
app.get("/health", async (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  })
})

// Endpoints de catálogo de especialidades (Parte 4 del lunes)
app.get("/api/specialties", async (_req: Request, res: Response) => {
  try {
    const especialidades = await prisma.especialidad.findMany({
      include: {
        medicos: true
      }
    })
    res.json(especialidades)
  } catch (error) {
    console.error("Error al obtener especialidades:", error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

app.get("/api/especialidades", async (_req: Request, res: Response) => {
  try {
    const especialidades = await prisma.especialidad.findMany({
      include: {
        medicos: true
      }
    })
    res.json(especialidades)
  } catch (error) {
    console.error("Error al obtener especialidades:", error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor de Clínica "Salud Integral" escuchando en el puerto ${PORT}`)
  console.log(`Directorio de Médicos: http://localhost:${PORT}/api/doctors`)
  console.log(`Directorio de Pacientes: http://localhost:${PORT}/api/patients`)
})
