import express from "express";
import session from "express-session";
import { router as adminRoutes } from "./routes/adminRoutes.js";
import { router as productRoutes } from "./routes/productRoutes.js";
import { router as pelangganRoutes } from "./routes/pelangganRoutes.js";
import { router as transactionRoutes } from "./routes/transactionRoutes.js";

const app = express();
const base_route = 3000;

app.use(
  session({
    secret: "blabla",
    resave: true,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));
app.use("/", adminRoutes);
app.use("/", productRoutes);
app.use("/", pelangganRoutes);
app.use("/", transactionRoutes);

app.listen(base_route, () => {
  console.log(`Server ready at port ${base_route}`);
});
