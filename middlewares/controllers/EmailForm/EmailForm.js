const EmailForm = require("../../models/EmailForm/EmailForm");
const fs = require("fs");

exports.getEmailFormDetails = async (req, res) => {
  try {
    const find = await EmailForm.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createEmailFormDetails = async (req, res) => {
  try {
   

    

    let {
      category,
      FormName,
      IsActive,
    } = req.body;

    const add = await new EmailForm({
      category,
      FormName,
      IsActive,
    }).save();
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listEmailFormDetails = async (req, res) => {
  try {
    const list = await EmailForm.find().sort({ FormName: 1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listEmailFormByCategory = async (req, res) => {
  try {
    const list = await EmailForm.find({
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

exports.listEmailFormDetailsByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "emailmasters",
          localField: "category",
          foreignField: "_id",
          as: "Email",
        },
      },
      {
        $unwind: {
          path: "$Email",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $match: {
          $or: [
            {
              FormName: { $regex: match, $options: "i" },
            },
            {
              "Email.Email": { $regex: match, $options: "i" },
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

    const list = await EmailForm.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateEmailFormDetails = async (req, res) => {
  try {
    let productImage = req.file
      ? `uploads/EmailForm/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (productImage != null) {
      fieldvalues.productImage = productImage;
    }

    const update = await EmailForm.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,

      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeEmailFormDetails = async (req, res) => {
  try {
    const del = await EmailForm.deleteOne({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};

// exports.CategoryLEDList = async (req, res) => {
//   try {
//     const { option, categoryid } = req.params;

//     const list = await EmailForm.find({
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
