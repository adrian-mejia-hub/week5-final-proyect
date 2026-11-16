import { Router } from "express"
import * as doctorController from "../controllers/doctor.controller.js"

const router = Router()

// Endpoint solicitado en Parte 3:
// GET /api/doctors?specialty=Cardiologia -> Lista médicos, filtrando por especialidad si se recibe el query string
router.get("/", doctorController.getAll)

// Endpoint complementario
router.get("/:id", doctorController.getById)

export default router
