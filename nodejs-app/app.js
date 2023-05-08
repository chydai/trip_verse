import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import groupRoutes from "./routes/group.js";
import channelRoutes from "./routes/channel.js";
import datePlanRoutes from "./routes/datePlan.js";
import placeRoutes from "./routes/place.js";
import billRoutes from "./routes/bill.js";
import debtRoutes from "./routes/debt.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comment.js"

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth/", authRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/group/", groupRoutes);
app.use("/api/channel", channelRoutes);
app.use("/api/dateplan", datePlanRoutes);
app.use("/api/place", placeRoutes);
app.use("/api/bill", billRoutes);
app.use("/api/debt", debtRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

export default app;
