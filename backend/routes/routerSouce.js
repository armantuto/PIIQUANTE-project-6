const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth")
const multer = require("../middleware/multer");

const souceControl = require("../controllers/controllerSauces");

router.get("/", souceControl.getAllSouces);
router.get("/:id", auth, souceControl.getOneSouce);
router.post("/", auth, multer, souceControl.createSouce)
router.put("/:id", auth, multer, souceControl.modifySouce)
router.delete("/:id", auth, souceControl.deleteSauce);
router.post("/:id/like", auth, souceControl.updateLikes)

module.exports = router