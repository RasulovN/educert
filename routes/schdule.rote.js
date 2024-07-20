const {
    getSchdules,
    createSchdule,
    changeSchdule,
    removeSchdule,
  } = require("../controllers/schdule.controller");
  const { isAuth } = require("../middleware/auth.middleware");
  
  const router = require("express").Router();
  
  router.get("/schdules", isAuth, getSchdules);
  router.post("/schdules/add", isAuth, createSchdule);
  router.put("/schdules/update/:id", isAuth, changeSchdule);
  router.delete("/schdules/delete/:id", isAuth, removeSchdule);
  
  module.exports = router;