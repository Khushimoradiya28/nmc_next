const express = require('express');
const router = express.Router();
const academicProgramController = require('../Controller/academicProgramController');

const { verifyToken } = require('../Middleware/authMiddleware');

router.get('/', academicProgramController.getAllPrograms);
router.get('/:slug', academicProgramController.getProgramById);
router.post('/', verifyToken, academicProgramController.addProgram);
router.put('/:slug', verifyToken, academicProgramController.updateProgram);
router.delete('/:slug', verifyToken, academicProgramController.deleteProgram);

module.exports = router;
