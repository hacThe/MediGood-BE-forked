const authRouter = require("./auth");
const productRouter = require("./product");
const newsRouter = require("./news");
const receiptRouter = require("./receipt");
const voucherRouter = require("./voucher");
const bannerRouter = require("./banner");
const userRouter = require("./user");
const dashboardRouter = require("./dashboard");

function route(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/news", newsRouter);
  app.use("/api/receipt", receiptRouter);
  app.use("/api/voucher", voucherRouter);
  app.use("/api/banner", bannerRouter);
  app.use("/api/dashboard", dashboardRouter);
}

module.exports = route;
