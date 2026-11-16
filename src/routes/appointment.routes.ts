import { Router } from "express"
import * as appointmentController from "../controllers/appointment.controller.js"
import { validateAppointment } from "../middlewares/validate-appointment.js"
import { verifyToken } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/authorize.middleware.js"

const router = Router()

// Endpoint Parte 1:
// POST /api/appointments -> Agenda una cita (autorizado para RECEPCIONISTA y MEDICO)
router.post(
  "/",
  verifyToken,
  authorize("RECEPCIONISTA", "MEDICO"),
  validateAppointment,
  appointmentController.create
)

// Endpoint Parte 3:
// PATCH /api/appointments/:id/status -> Cambia el estado de una cita (protegido con authorize('MEDICO'))
router.patch(
  "/:id/status",
  verifyToken,
  authorize("MEDICO"),
  appointmentController.updateStatus
)

export default router
