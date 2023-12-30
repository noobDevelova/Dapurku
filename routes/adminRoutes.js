import express from "express";
import { getAdminList, requireLogin } from "../models/users.js";
import { ProductModel } from "../models/products.js";

const router = express.Router();

// Ambil Kelas Produk
const productModel = new ProductModel();

// Process Login Admin
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    getAdminList((err, adminList) => {
      if (err) {
        console.log(err);
        res.redirect("/admin/login");
        return;
      }

      const admin = adminList.find((admin) => admin.email === email);

      if (admin) {
        if (password === admin.password) {
          req.session.userId = admin.id_admin;
          req.session.username = admin.email;

          res.redirect("/admin/dashboard");
        } else {
          res.redirect("/admin/login");
        }
      } else {
        res.redirect("/admin/login");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Login Page Admin
router.get("/admin/login", (req, res) => {
  res.render("admin/login");
});

// Dashboard admin
router.get("/admin/dashboard", requireLogin, (req, res) => {
  res.render("admin/dashboard", { username: req.session.username });
});

// Logout
router.get("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/admin/login");
  });
});

// List Makanan
router.get("/admin/makanan", requireLogin, (req, res) => {
  productModel.getProductList((err, productList) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    console.log(productList);
    res.render("admin/stok", { menu: productList });
  });
});

// Add Page
router.get("/admin/tambah", requireLogin, (req, res) => {
  res.render("admin/tambah");
});

export { router };
