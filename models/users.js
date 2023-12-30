import db from "../config.js";

const getAdminList = (getAdmin) => {
  const admin_query = `SELECT * FROM admin`;
  db.query(admin_query, (err, result) => {
    if (err) {
      console.log(err);
      getAdmin(err, null);
      return;
    }

    const list_admin = JSON.parse(JSON.stringify(result));
    getAdmin(null, list_admin);
  });
};

const getPelangganList = (getPelanggan) => {
  const query_pelanggan = `SELECT * FROM pelanggan`;

  db.query(query_pelanggan, (err, result) => {
    if (err) {
      console.log(err);
      getPelanggan(err, null);
      return;
    }

    const list_pelanggan = JSON.parse(JSON.stringify(result));
    getPelanggan(null, list_pelanggan);
  });
};

const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};

export { getAdminList, getPelangganList, requireLogin };
