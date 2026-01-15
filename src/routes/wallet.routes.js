const express = require("express");
const router = express.Router();

// Temporary dummy handlers
router.get("/balance", (req, res) => {
    res.send("Wallet balance route works!");
});

router.post("/fund", (req, res) => {
    res.send("Fund wallet route works!");
});

router.post("/transfer", (req, res) => {
    res.send("Transfer route works!");
});

module.exports = router;

/**
 * @swagger
 * /api/wallet/balance:
 *   get:
 *     tags: [Wallet]
 *     summary: Get wallet balance
 *     responses:
 *       200:
 *         description: Returns wallet balance
 */

