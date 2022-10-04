const { populate } = require("../models/product");
const Product = require("../models/product");
const FilterConverter = require("../utils/filterConverter");

class ProductController {
  getList = async (req, res) => {
    // console.log("Vô nhầm route")
    // params = {price: "1,299999999;5000000,6000000"}
    // const params = req.query

    // const sampleFilter = {
    //   productType: ["wine"],
    //   color: ["red"],
    //   price: [
    //     { _min: 1, _max: 700000 },
    //     { _min: 30000, _max: 50000 },
    //   ],
    //   capacity: [750, 1000],
    //   concentrationPercent: [
    //     { _min: 1, _max: 29999 },
    //     { _min: 30000, _max: 50000 },
    //   ],
    //   producer: ["Nhà tao", "Nhà ba tao"],
    //   foods: ["Gà", "Bò", "Vịt"],
    // };

    const params = req.query;

    const queryElement = [];
    if (params && params.productType && params.productType.includes("wine")) {
      if (params.price) {
        const querryPrice = FilterConverter.rangeFilter("price", params.price);
        queryElement.push(querryPrice);
      }

      if (
        params.concentrationPercent &&
        params.concentrationPercent.length != 0
      ) {
        const querryPrice = FilterConverter.rangeFilter(
          "concentrationPercent",
          params.concentrationPercent
        );
        queryElement.push(querryPrice);
      }

      if (params.color && params.color.length != 0) {
        const querryPrice = FilterConverter.multipleValuesFilter(
          "color",
          params.color
        );
        queryElement.push(querryPrice);
      }

      if (params.capacity && params.capacity.length != 0) {
        const querryPrice = FilterConverter.multipleValuesFilter(
          "capacity",
          params.capacity
        );
        queryElement.push(querryPrice);
      }

      if (params.producer && params.producer.length != 0) {
        const querryPrice = FilterConverter.multipleValuesFilter(
          "producer",
          params.producer
        );
        queryElement.push(querryPrice);
      }

      if (params.foods && params.foods.length != 0) {
        const querryPrice = FilterConverter.multipleValuesInList(
          "foods",
          params.foods
        );
        queryElement.push(querryPrice);
      }
    }
    queryElement.push({
      productType: 'wine'
    })

    console.log("query element: ", queryElement);
    console.log(
      JSON.stringify(FilterConverter.combineFilter(queryElement), null, 2)
    );

    //FilterConverter.combineFilter(queryElement)
    Product.find(FilterConverter.combineFilter(queryElement))
      .sort({ createdAt: -1 })
      .exec()
      .then((data) => {
        // if ( params && params.price){
        //   const minPrice = params.price.split(",")[0];
        //   const maxPrice = par
        // }

       // console.log("dataaa: ", data);
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

  getListSpecialProduct = async (req, res) => {
    const query = {
      $or: [
        {
          productType: { $eq: "combo" },
        },
        {
          productType: { $eq: "gift" },
        },
        {
          isSpecialProduct: { $eq: true },
        },
        {
          isNewProduct: { $eq: true },
        },
        {
          isSaleProduct: { $eq: true },
        },
      ],
    };
    Product.find(query)
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

  getListAccessary = async (req, res) => {
    const query = {
      productType: { $eq: "accessary" },
    };
    Product.find(query)
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
    Product.findById(req.params.id)
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
    const product = req.body;
    const _product = new Product({
      ...product,
      isSaleProduct: product.price < product.originPrice,
    });

    console.log("debug 2", _product);
    _product
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
    const product = req.body;
    if (product.price < product.originPrice) {
      product.isSaleProduct = true;
    } else {
      product.isSaleProduct = false;
    }

    Product.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          ...product,
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

  deleteMany = async (req, res) => {
    res.status(200).send("Hihi delete many");
  };

  _delete = async (req, res) => {
    Product.deleteOne({ _id: req.params.id }, function (err, data) {
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

  getProductsInCart = async (req, res) => {
    try {
      const cart = req.body.cart;
      var ObjectId = require("mongodb").ObjectId;

      const listID = cart.map((item) => {
        var _oID = new ObjectId(item.product);
        return _oID;
      });
      const products = await Product.find({ _id: { $in: listID } }).exec();
      const data = products.map((item) => {
        var cartItem = { product: item, quantity: 0 };
        cart.forEach((element) => {
          var _oID = new ObjectId(element.product);
          if (_oID.toString() === item._id.toString())
            cartItem.quantity = element.quantity;
        });
        return cartItem;
      });
      console.log("dataaa: ", data);
      res.status(200).send(
        JSON.stringify({
          data: data,
        })
      );
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
}

module.exports = new ProductController();
