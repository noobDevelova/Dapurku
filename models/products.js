import db from "../config.js";

class ProductModel {
  getProductList(getProduct) {
    const menu_query = `SELECT * FROM menu`;
    db.query(menu_query, (err, result) => {
      if (err) {
        console.log(err);
        getProduct(err, null);
        return;
      }

      const list_product = JSON.parse(JSON.stringify(result));
      getProduct(null, list_product);
    });
  }

  getProductById(productId, getProduct) {
    const product_query = `SELECT * FROM menu where id_makanan = ?`;

    db.query(product_query, [productId], (err, result) => {
      if (err) {
        console.log(err);
        getProduct(err, null);
        return;
      }

      const product = JSON.parse(JSON.stringify(result[0]));
      getProduct(null, product);
    });
  }

  updateProductById(productId, updatedProduct, updateProduct) {
    const { jenis_makanan, kategori, stok, harga } = updatedProduct;
    const update_query = `UPDATE menu SET jenis_makanan = ?, kategori = ?, stok = ?, harga = ? WHERE id_makanan = ?`;

    db.query(
      update_query,
      [jenis_makanan, kategori, stok, harga, productId],
      (err, result) => {
        if (err) {
          console.log(err);
          updateProduct(err, null);
          return;
        }

        updateProduct(null, updatedProduct);
      }
    );
  }

  addProduct(productData, addProduct) {
    const { jenis_makanan, kategori, stok, harga } = productData;
    const menu_query = `INSERT INTO menu (jenis_makanan, kategori, stok, harga) VALUES (?, ?, ?, ?)`;

    db.query(
      menu_query,
      [jenis_makanan, kategori, stok, harga],
      (err, result) => {
        if (err) {
          console.log(err);
          addProduct(err, null);
        }

        const addedProduct = {
          id_makanan: result.insertId,
          jenis_makanan,
          kategori,
          stok,
          harga,
        };

        addProduct(null, addedProduct);
      }
    );
  }

  deleteProduct(productId, deleteProduct) {
    const delete_query = `DELETE FROM menu WHERE id_makanan = ?`;

    db.query(delete_query, [productId], (err, result) => {
      if (err) {
        console.log(err);
        deleteProduct(err, null);
      }

      const deletedProduct = {
        id_makanan: productId,
      };

      deleteProduct(null, deletedProduct);
    });
  }

  orderProduct(id_pelanggan, menuPemesanan, pesananSelesai) {
    // Langkah 1: Memulai transaksi
    db.beginTransaction((err) => {
      if (err) {
        console.log(err);
        pesananSelesai(err, null);
        return;
      }

      // Langkah 2: Membuat data transaksi baru
      const tambahTransaksiQuery = `INSERT INTO transaksi (id_pelanggan) VALUES (?)`;
      db.query(tambahTransaksiQuery, [id_pelanggan], (err, hasilTransaksi) => {
        if (err) {
          return db.rollback(() => {
            console.log(err);
            pesananSelesai(err, null);
          });
        }

        const id_transaksi = hasilTransaksi.insertId;

        // Langkah 3: Menyimpan detail pesanan untuk setiap menu
        const tambahDetailPesananQuery = `INSERT INTO detail_pesanan (id_transaksi, id_menu, kuantitas, harga, status) VALUES (?, ?, ?, ?, ?)`;

        const detailPesananValues = {
          id_transaksi: id_transaksi,
          id_makanan: menuPemesanan.id_menu,
          kuantitas: parseInt(menuPemesanan.kuantitas),
          harga: menuPemesanan.harga,
          status: "Menunggu Pembayaran",
        };

        db.query(
          tambahDetailPesananQuery,
          detailPesananValues,
          (err, hasilDetailPesanan) => {
            if (err) {
              return db.rollback(() => {
                console.log(err);
                pesananSelesai(err, null);
                console.log(detailPesananValues);
                console.log(menuPemesanan);
              });
            }

            // Jika sampai di sini tanpa error, commit transaksi
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.log(err);
                  pesananSelesai(err, null);
                });
              }

              // Panggil callback dengan id_transaksi atau hasil lain yang diperlukan
              pesananSelesai(null, id_transaksi);
            });
          }
        );
      });
    });
  }
}

export { ProductModel };
