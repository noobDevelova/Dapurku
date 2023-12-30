import express from "express";
import { ProductModel } from "../models/products.js";
import { requireLogin } from "../models/users.js";

const router = express.Router();
const productModel = new ProductModel();

// Edit Menu
router.get("/admin/edit/:id", requireLogin, (req, res) => {
  const id_makanan = req.params.id;
  productModel.getProductById(id_makanan, (err, product) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    console.log(product);

    res.render("admin/edit", { product });
  });
});

// Update Menu
router.post("/admin/edit/:id", requireLogin, (req, res) => {
  const id_item = req.params.id;
  const updatedProductData = req.body;

  productModel.updateProductById(
    id_item,
    updatedProductData,
    (err, updatedProduct) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.redirect("/admin/makanan");
    }
  );
});

// Add Menu
router.post("/admin/tambah", requireLogin, (req, res) => {
  const productData = req.body;
  productModel.addProduct(productData, (err, addedProduct) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      console.log(addedProduct);
      return;
    }

    res.redirect("/admin/makanan");
  });
  console.log(productData);
});

// Delete Menu
router.get("/admin/hapus/:id", requireLogin, (req, res) => {
  const id_produk = req.params.id;

  productModel.deleteProduct(id_produk, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.redirect("/admin/makanan");
  });
});

export { router };
