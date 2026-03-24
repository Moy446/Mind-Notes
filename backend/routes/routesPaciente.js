import express from "express";
import calendarController from "../controllers/calendarioController.js";
import protector from "../helpers/routesProtect.js";

const router = express.Router();

router.get('/getPsicologist', protector, calendarController.loadPsycologist)
router.get('/calendario/:idPsicologo',protector,calendarController.loadCalendarPacient);

export default router