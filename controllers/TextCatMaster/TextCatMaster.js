const TestCatMaster = require("../../models/TestCatMaster/TextCatMaster");
const fs = require("fs");

exports.getTestCatMasterDetails = async (req, res) => {
  try {
    const find = await TestCatMaster.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createTestCatMasterDetails = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/TestCatMaster`)) {
      fs.mkdirSync(`${__basedir}/uploads/TestCatMaster`);
    }

    let productImage = req.file
      ? `uploads/TestCatMaster/${req.file.filename}`
      : null;

    let {
      category,
      TestName,
      TotalQues,
      TotalTime,
      IsHabit,
      Desc,
      HindiDesc,
      GujDesc,
      EngDesc,
      IsActive,
    } = req.body;

    const add = await new TestCatMaster({
      category,
      productImage,
      TestName,
      TotalQues,
      TotalTime,
      IsHabit,
      Desc,
      HindiDesc,
      GujDesc,
      EngDesc,
      IsActive,
    }).save();
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listTestCatMasterDetails = async (req, res) => {
  try {
    const list = await TestCatMaster.find().sort({ TestName: 1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listTestCatMasterExamDetails = async (req, res) => {
  try {
    const list = await TestCatMaster.find()
      .sort({ TestName: 1 })
      .populate("category") // Populate the 'category' field with data from the referenced collection
      .exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};


exports.listTestCatMasterExamDetail = async (req, res) => {
  try {
    const list = await TestCatMaster.find()
      .sort({ TestName: 1 })
      .exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listTestCatMasterByCategory = async (req, res) => {
  try {
    const list = await TestCatMaster.find({
      category: req.params.categoryId,
      IsActive: true,
    })
      .sort({ createdAt: -1 })
      .exec();
    if (list) {
      res.status(200).json({ isOk: true, data: list, message: "" });
    } else {
      res.status(200).json({ isOk: false, message: "No data Found" });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listTestCatMasterDetailsByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "testcats", // Matches the collection name used for TestCat
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            {
              TestName: { $regex: match, $options: "i" },
            },
            {
              "category.categoryName": { $regex: match, $options: "i" },
            },
          ],
        },
      },
      {
        $sort:
          sorton && sortdir
            ? { [sorton]: sortdir == "desc" ? -1 : 1 }
            : { createdAt: -1 },
      },
      {
        $facet: {
          stage1: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
          stage2: [
            {
              $skip: skip,
            },
            {
              $limit: per_page,
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$stage1",
        },
      },
      {
        $project: {
          count: "$stage1.count",
          data: "$stage2",
        },
      },
    ];

    const list = await TestCatMaster.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};


exports.updateTestCatMasterDetails = async (req, res) => {
  try {
    let productImage = req.file
      ? `uploads/TestCatMaster/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (productImage != null) {
      fieldvalues.productImage = productImage;
    }

    const update = await TestCatMaster.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,

      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeTestCatMasterDetails = async (req, res) => {
  try {
    const del = await TestCatMaster.deleteOne({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.listTestCatMasterDetailsByCategory = async (req, res) => {
  try {
    // Fetch all TestCatMaster documents and populate the category field
    const list = await TestCatMaster.find()
      .sort({ TestName: 1 })
      .populate("category")
      .exec();

    // Filter the results by matching categoryName
    const filteredList = list.filter(
      (item) =>
        item.category && item.category.categoryName === req.params.category
    );

    if (filteredList.length === 0) {
      return res.status(404).json({ message: "No matching categories found" });
    }

    res.json(filteredList);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

