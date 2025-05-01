import app from "./server";
import express from "express";
const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
