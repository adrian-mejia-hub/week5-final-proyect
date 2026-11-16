import "dotenv/config"
import express, { Request, Response } from "express"
import prisma from "./config/prisma.js"

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Endpoint de salud
app.get("/health", async (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  })
})

// Endpoint de verificación (Parte 4): Listar especialidades
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

// Alias /api/specialties solicitado en la guía
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

// Endpoint adicional útil: Directorio de médicos con filtro de especialidad
app.get("/api/medicos", async (req: Request, res: Response) => {
  try {
    const { especialidadId } = req.query
    const where = especialidadId ? { especialidadId: Number(especialidadId) } : {}

    const medicos = await prisma.medico.findMany({
      where,
      include: {
        especialidad: true
      }
    })
    res.json(medicos)
  } catch (error) {
    console.error("Error al obtener médicos:", error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor de Clínica "Salud Integral" escuchando en el puerto ${PORT}`)
  console.log(`Endpoint de verificación: http://localhost:${PORT}/api/especialidades`)
})
