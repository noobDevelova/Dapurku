import express from "express";
import { requireLogin } from "../models/users.js";
import { ProductModel } from "../models/products.js";

const router = express.Router();
const productModel = new ProductModel();

router.post("/pelanggan/order/:id", (req, res) => {
  const id_pelanggan = req.session.id_pelanggan;
  const id_makanan = req.params.id;
  const kuantitas = req.body.kuantitas;

  productModel.getProductById(id_makanan, (err, product) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const menu_pesanan = {
      id_menu: product.id_makanan,
      kuantitas: kuantitas,
      harga: parseFloat(kuantitas * product.harga),
    };

    console.log(menu_pesanan);
    productModel.orderProduct(
      id_pelanggan,
      menu_pesanan,
      (err, id_transaksi) => {
        if (err) {
          console.log("Error saat memesan:", err);
          res.status(500).send("Internal Server Error");
          return;
        }

        console.log("Pesanan berhasil! ID Transaksi:", id_transaksi);

        res.status(200).send("Pesanan berhasil!");
      }
    );
  });
});

export { router };
