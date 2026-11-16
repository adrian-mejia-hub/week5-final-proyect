import { Router } from "express"
import * as patientController from "../controllers/patient.controller.js"
import { validatePatient } from "../middlewares/validate-patient.js"
import { verifyToken } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/authorize.middleware.js"

const router = Router()

// Rutas protegidas para el rol RECEPCIONISTA (Módulo de Recepción)
// POST /api/patients -> Crea un paciente
router.post("/", verifyToken, authorize("RECEPCIONISTA"), validatePatient, patientController.create)

// GET /api/patients -> Lista todos los pacientes
router.get("/", verifyToken, authorize("RECEPCIONISTA"), patientController.getAll)

// GET /api/patients/:id -> Expediente completo del paciente por ID
router.get("/:id", verifyToken, authorize("RECEPCIONISTA"), patientController.getById)

export default router
