const express = require("express");
const db = require("../firebase");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db
      .collection("ideas")
      .orderBy("score", "desc")
      .limit(5)
      .get();

    const ideas = snapshot.docs.map(doc => doc.data());

    res.json(ideas);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
});

module.exports = router;