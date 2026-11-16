import { Router } from "express"
import * as doctorController from "../controllers/doctor.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/authorize.middleware.js"

const router = Router()

// Rutas protegidas para el rol RECEPCIONISTA (Módulo de Recepción)
// GET /api/doctors?specialty=Cardiologia -> Directorio de médicos filtrable
router.get("/", verifyToken, authorize("RECEPCIONISTA"), doctorController.getAll)

// GET /api/doctors/:id -> Detalle de médico
router.get("/:id", verifyToken, authorize("RECEPCIONISTA"), doctorController.getById)

export default router
