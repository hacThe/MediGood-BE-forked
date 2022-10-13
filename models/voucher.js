const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Voucher = new Schema(
  {
    name: String,
    avtURL: String, // voucher avt
    code: String, //Mã km
    description: String, //Mô tả
    amount: Number, // Số lượng km
    limit: Number, // Giới hạn ( Số tiền)
    type: Number, // 1: money, 2: percent
    isPublic: Boolean, // Có hiển thị public trong lúc chọn voucher hay k
    receipts: [{ type: Schema.Types.ObjectId, ref: "receipt" }], // danh sách hóa đơn đã áp mã
    isEnable: Boolean, // Vô hiệu hóa/kích hoạt
    quantity: Number, // số lượt sử dụng còn lại
    exp: Date, // Ngày hết hạn
    condition: {
      // Điều kiện cho đơn hàng
      productCount: Number, // Số sản phẩm tối thiểu trong 1 lần mua
      minTotalPrice: Number, // Giá tối thiểu
      isFirstTime: Boolean, // Là km dành cho người mới
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("voucher", Voucher);
