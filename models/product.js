const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: String, // Tên sản phẩm
    sku: String, // Mã sản phẩm
    aboutProduct: String, // Một đoạn ngắn mô tả thông tin sản phẩm
    avtURL: String, // Hình đại diện sản phẩm
    imgURLs: [String], // Các ảnh kèm theo
    quantity: Number, // Số lượng
    importPrice: Number, // Giá nhập
    originPrice: Number, // Giá bán gốc
    price: Number, // Giá bán
    temperature: { minimum: Number, maximum: Number }, // Nhiệt độ sử dụng
    color: String, // Màu sắc của rượu
    foods: [String], // Các thức ăn kèm, lưu String là tên như dưới
    /*
   1 - Phô mai 
   2 - Bánh ngọt
   3 - Thịt bò
   4 - Thịt gà
   5 - Thịt lợn
   6 - Thịt vịt
   7 - Rau củ quả
   8 - Hải sản
   9 - Thịt thỏ
   10 - Thịt cừu
   Gồm những loại này nha fen :3 sẽ có icon riêng cho từng sản phẩm cho đẹp
   */

    origin: String, // Xuất xứ
    producer: String, //Nhà sản xuất
    concentrationPercent: Number, //  nồng độ cồn ( tính theo %)
    capacity: Number, // Dung tích (ml)
    vintage: Number, // Năm sản xuất
    sugar: Number, // Hàm lượng đường
    experation: Date,
    productType: String, // wine/combo/accessory,
    isSpecialProduct: Boolean, // :à sản phẩm đặc biệt
    isNewProduct: Boolean, // là sản phẩm mới
    hasSold: Number, // số lượng sản phẩm đã bán
    isSaleProduct: Boolean,
  },
  { timestamps: true }
);

const Product = mongoose.model("products", ProductSchema);
module.exports = Product;

const sampleFilter = {
  productType: "wine",
  color: ["red", "pink"],
  price: [
    { _min: 1, _max: 29999 },
    { _min: 30000, _max: 50000 },
  ],
  capicity: [750, 1000],
  concentrationPercent: [
    { _min: 1, _max: 29999 },
    { _min: 30000, _max: 50000 },
  ],
  producer: ["Nhà tao", "Nhà ba tao"],
  foods: ["Gà", "Bò", "Vịt"],
};
