const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: String,               // Tên sản phẩm
    productCode: String,        // Mã sản phẩm
    thumbnailUrl: String,       // Hình đại diện sản phẩm
    imgUrls: [String],          // Các ảnh kèm theo
    quantity: Number,           // Số lượng
    importPrice: Number,        // Giá nhập
    originPrice: Number,        // Giá bán gốc
    price: Number,              // Giá bán
    category: String,           // loại, danh mục
    origin: String,             // Xuất sứ
    producer: String,           //Nhà sản xuất
    age: String,                // Độ tuổi sử dụng
    dosageForm: String,         // Dạng bào chế ( viên nén ... )
    note: String,               // Lưu ý
    aboutProduct: String,       // Mô tả thông tin sản phẩm <html string>
    experation: Date,           // Hạn sử dụng
    hasSold: Number,            // số lượng sản phẩm đã bán
  },
  { timestamps: true }
);

const Product = mongoose.model("products", ProductSchema);
module.exports = Product;
