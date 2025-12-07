import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  res.send("Create event");
});

router.get("/", (req, res) => {
  res.send("List events");
});

router.put("/:id", (req, res) => {
  res.send("Update event");
});

export default router;
