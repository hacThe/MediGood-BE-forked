const Voucher = require("../models/voucher");
class VoucherController {
  getAll = async (req, res) => {
    console.log("Vô voucher");
    Voucher.find()
      .sort({ createdAt: -1 })
      .exec()
      .then((data) => {
        res.status(200).send(
          JSON.stringify({
            data: data,
          })
        );
      })
      .catch((error) => {
        res.status(404).send(error);
      });
  };
  getOne = async (req, res) => {
    Voucher.findById(req.params.id)
      .then((product) => {
        res.status(200).send(
          JSON.stringify({
            data: product,
          })
        );
      })
      .catch((error) => {
        res.status(404).send(error);
      });
  };

  create = async (req, res) => {
    const voucher = req.body;
    const _voucher = new Voucher({
      ...voucher,
    });

    console.log("debug 2", _voucher);
    _voucher
      .save()
      .then((data) => {
        res.status(200).send(JSON.stringify(data));
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send(err);
      });
  };

  update = async (req, res) => {
    const id = req.params.id;
    const voucher = req.body;

    Voucher.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          ...voucher,
        },
      },
      {
        returnOriginal: false,
      },
      function (err, data) {
        console.log({ err, data });
        if (err) {
          res.status(404).send(err);
        } else {
          res.status(200).send(JSON.stringify({ data }));
        }
      }
    );
  };

  check = async (req, res) => {
    try {
      const voucherCode = req.params.id;
      const { totalPrice, productCount } = req.body;
      console.log({ voucherCode, totalPrice, productCount });
      const voucher = await Voucher.findOne({ code: voucherCode });

      if (!voucher) {
        res.status(200).send(
          JSON.stringify({
            success: false,
            message: "Không tồn tại mã giảm giá, vui lòng kiểm tra lại",
          })
        );
      }

      if (
        voucher.condition.productCount > productCount ||
        voucher.condition.minTotalPrice > totalPrice
      ) {
        res.status(200).send(
          JSON.stringify({
            success: false,
            message: "Không đủ điều kiện sử dụng mã giảm giá",
          })
        );
      }
      let amount = voucher.amount;

      if (voucher.type === 2) {
        amount = (totalPrice * amount) / 100;
      }

      amount = voucher.limit > amount ? amount : voucher.limit;

      res.status(200).send(
        JSON.stringify({
          success: true,
          message: "Áp dụng mã giảm giá thành công",
          voucher: {
            voucher: voucher._id,
            amount,
          },
        })
      );
    } catch (e) {
      res.status(200).send(
        JSON.stringify({
          success: false,
          message: "Lỗi hệ thống, xin lỗi vì sự bất tiện này",
        })
      );
    }
  };

  _delete = async (req, res) => {
    Voucher.deleteOne({ _id: req.params.id }, function (err, data) {
      console.log({ err, data });
      if (err) {
        res.status(404).send(err);
      } else {
        res
          .status(200)
          .send(JSON.stringify({ message: "Delete Successfully", data }));
      }
    });
  };
}
module.exports = new VoucherController();
