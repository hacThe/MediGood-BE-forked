const express = require("express");
const router = express.Router();

const VoucherController = require("../controllers/VoucherController");
const { AuthMiddleware } = require("../helper/JWT");
//--------
//these router handle sign in and sign up
router.get("/list", VoucherController.getAll);
router.get("/:id", VoucherController.getOne);
router.post("/check/:id", VoucherController.check);
router.post("/new", VoucherController.create);
router.put("/:id", VoucherController.update);
router.delete("/:id", VoucherController._delete);

//

//--------
//these router handle authentication and authorization

//
module.exports = router;
