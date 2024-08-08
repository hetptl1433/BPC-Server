const HalleBoard = require("../../models/HallImage/HallImage");
const fs = require("fs");

exports.getHalleBoardDetails = async (req, res) => {
  try {
    const find = await HalleBoard.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createHalleBoardDetails = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/HalleBoard`)) {
      fs.mkdirSync(`${__basedir}/uploads/HalleBoard`);
    }

    let productImage = req.file
      ? `uploads/HalleBoard/${req.file.filename}`
      : null;

    let {
      category,
      SortOrder,
      IsActive,
    } = req.body;

    const add = await new HalleBoard({
      category,
      productImage,
      SortOrder,
      IsActive,
    }).save();
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listHalleBoardDetails = async (req, res) => {
  try {
    console.log("Fetching HalleBoard details...");
    const list = await HalleBoard.find().sort({ SortOrder: 1 }).exec();
    if (!list || list.length === 0) {
      console.log("No HalleBoard details found.");
      return res.status(404).json({ message: "No data found" });
    }
    console.log("HalleBoard details fetched successfully:", list);
    res.json(list);
  } catch (error) {
    console.error("Error listing HalleBoard details:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};


exports.listHalleBoardByCategory = async (req, res) => {
  try {
    const list = await HalleBoard.find({
      category: req.params.categoryId,
      IsActive: true,
    })
      .sort({ createdAt: -1 })
      .exec();
    if (list) {
      res.json(list);
      res.status(200).json({ isOk: true, data: list, message: "done" });
    } else {
      res.status(200).json({ isOk: false, message: "No data Found" });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listHalleBoardDetailsByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "hallimagemasters",
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
              SortOrder: { $regex: match, $options: "i" },
            },
            {
              "category.categoryName": { $regex: match, $options: "i" },
            },
          ],
        },
      },

      {
        $facet: {
          stage1: [
            {
              $group: {
                _id: null,
                count: {
                  $sum: 1,
                },
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
   

    if (sorton && sortdir) {
      let sort = {};
      sort[sorton] = sortdir == "desc" ? -1 : 1;
      query = [
        {
          $sort: sort,
        },
      ].concat(query);
    } else {
      let sort = {};
      sort["createdAt"] = -1;
      query = [
        {
          $sort: sort,
        },
      ].concat(query);
    }

    const list = await HalleBoard.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateHalleBoardDetails = async (req, res) => {
  try {
    let productImage = req.file
      ? `uploads/HalleBoard/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (productImage != null) {
      fieldvalues.productImage = productImage;
    }

    const update = await HalleBoard.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,

      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeHalleBoardDetails = async (req, res) => {
  try {
    const del = await HalleBoard.deleteOne({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};

// exports.CategoryHalleList = async (req, res) => {
//   try {
//     const { option, categoryid } = req.params;

//     const list = await HalleBoard.find({
//       category: categoryid,
//       IsActive: true,
//     })
//       .sort({ createdAt: -1 })
//       .exec();

//     let sortedList;

//     switch (option) {
//       case "1": // Newest
//         sortedList = list;
//         break;
//       case "2": // Price low to high
//         sortedList = list.sort((a, b) => a.price - b.price);
//         break;
//       case "3": // Price high to low
//         sortedList = list.sort((a, b) => b.price - a.price);

//         break;
//       case "4": // A to Z
//         sortedList = list.sort((a, b) =>
//           a.productName.localeCompare(b.productName)
//         );
//         break;
//       case "5": // Z to A
//         sortedList = list.sort((a, b) =>
//           b.productName.localeCompare(a.productName)
//         );
//         break;
//       default:
//         // Default sorting, perhaps by createdAt descending
//         sortedList = list;
//     }

//     if (sortedList) {
//       res.status(200).json({ isOk: true, data: sortedList, message: "" });
//     } else {
//       res.status(200).json({ isOk: false, message: "No data Found" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(400).send(error);
//   }
// };
