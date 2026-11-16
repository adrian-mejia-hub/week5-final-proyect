import { Router } from "express"
import * as patientController from "../controllers/patient.controller.js"
import { validatePatient } from "../middlewares/validate-patient.js"

const router = Router()

// Endpoints según requerimiento de Parte 2:
// POST /api/patients -> Crea un paciente validado con validatePatient
router.post("/", validatePatient, patientController.create)

// GET /api/patients -> Lista todos los pacientes
router.get("/", patientController.getAll)

// GET /api/patients/:id -> Un paciente por id (404 si no existe)
router.get("/:id", patientController.getById)

export default router
