import "dotenv/config"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import express, { Request, Response } from "express"
import swaggerUi from "swagger-ui-express"
import prisma from "./config/prisma.js"
import authRoutes from "./routes/auth.routes.js"
import patientRoutes from "./routes/patient.routes.js"
import doctorRoutes from "./routes/doctor.routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Cargar documentación Swagger
const swaggerPath = path.resolve(process.cwd(), "swagger-output.json")
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"))
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}

// Rutas de Autenticación (Paso 5: bajo /api/auth)
app.use("/api/auth", authRoutes)

// Rutas Protegidas de Pacientes (Módulo de Recepción)
app.use("/api/patients", patientRoutes)
app.use("/api/pacientes", patientRoutes)

// Rutas Protegidas de Médicos (Módulo de Recepción)
app.use("/api/doctors", doctorRoutes)
app.use("/api/medicos", doctorRoutes)

// Endpoint de salud
app.get("/health", async (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  })
})

// Catálogo de especialidades (acceso público / catálogo general)
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
  console.log(`Documentación Swagger: http://localhost:${PORT}/api/docs`)
  console.log(`Rutas de Auth: http://localhost:${PORT}/api/auth`)
  console.log(`Rutas de Pacientes: http://localhost:${PORT}/api/patients`)
  console.log(`Directorio de Médicos: http://localhost:${PORT}/api/doctors`)
})
