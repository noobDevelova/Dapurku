import express from "express";
import { getPelangganList, requireLogin } from "../models/users.js";
import { ProductModel } from "../models/products.js";

const router = express.Router();
const productModel = new ProductModel();

router.get("/pelanggan/login", (req, res) => {
  res.render("pelanggan/login");
});

router.get("/pelanggan/beranda", requireLogin, (req, res) => {
  productModel.getProductList((err, productList) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.render("pelanggan/beranda", { menu: productList });
  });
});

router.post("/pelanggan/login", (req, res) => {
  const { email, password } = req.body;

  try {
    getPelangganList((err, pelangganList) => {
      if (err) {
        console.log(err);
        res.redirect("/pelanggan/login");
        return;
      }

      const pelanggan = pelangganList.find(
        (pelanggan) => pelanggan.email === email
      );

      if (pelanggan) {
        if (pelanggan.password === password) {
          req.session.userId = pelanggan.id_pelanggan;
          req.session.username = pelanggan.username;
          res.redirect("/pelanggan/beranda");
        } else {
          res.redirect("/pelanggan/login");
        }
      } else {
        res.redirect("/pelanggan/beranda");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/pelanggan/masukkanKeranjang/:id", requireLogin, (req, res) => {});

router.get("/pelanggan/keranjang", requireLogin, (req, res) => {});

export { router };
