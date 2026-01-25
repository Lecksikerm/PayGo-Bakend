const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const authRoutes = require("./routes/auth.routes");
const walletRoutes = require("./routes/wallet.routes");
const profileRoutes = require("./routes/profile.routes");
const adminRoutes = require("./routes/admin.routes");
const pinRoutes = require("./routes/pin.routes");

const walletController = require("./controllers/wallet.controller");

const app = express();

app.use(cors());
app.use(morgan("dev"));

/**
 * PAYSTACK WEBHOOK (must use raw body)
 */
app.post(
  "/api/wallet/webhook/paystack",
  express.raw({ type: "application/json" }),
  walletController.paystackWebhook
);

/**
 * JSON parser for all other routes
 */
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/wallet/pin", pinRoutes); 
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "awake" });
});

app.get("/", (req, res) => {
  res.send("PayGo Backend Running...");
});

module.exports = app;




