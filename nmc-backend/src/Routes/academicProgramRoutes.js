const express = require('express');
const router = express.Router();
const academicProgramController = require('../Controller/academicProgramController');

router.get('/', academicProgramController.getAllPrograms);
router.get('/:slug', academicProgramController.getProgramById);
router.post('/', academicProgramController.addProgram);
router.put('/:slug', academicProgramController.updateProgram);
router.delete('/:slug', academicProgramController.deleteProgram);

module.exports = router;
