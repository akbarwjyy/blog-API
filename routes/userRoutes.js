const checkRole = require("../middlewares/checkRole");

router.get("/admin-only", authMiddleware, checkRole("admin"), (req, res) => {
  res.send("Hanya admin yang bisa melihat ini!");
});
