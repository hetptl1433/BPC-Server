const IndustryUserMaster = require("../../models/IndustryUserMaster/IndustryUserMaster");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { getUserGroupMaster } = require("../UserGroup/UserGroup");
const saltRounds = 10;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};


exports.getIndustryUserMasterDetails = async (req, res) => {
  try {
    const find = await IndustryUserMaster.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};



exports.createIndustryUserMasterDetails = async (req, res) => {
  try {
    // Check and create directory if it doesn't exist
    if (!fs.existsSync(`${__basedir}/uploads/IndustryUserMaster`)) {
      fs.mkdirSync(`${__basedir}/uploads/IndustryUserMaster`);
    }

    // Set product image path if file is provided
    let productImage = req.file
      ? `uploads/IndustryUserMaster/${req.file.filename}`
      : null;

    // Destructure request body
    let {
      UserGroupCategory,
      IndustryCategory,
      Name,
      Email,
      Mobile,
      landLine,
      UserName,
      Password,
      Address,
      IsActive,
    } = req.body;

    // Hash the password before saving it


    // Create new IndustryUserMaster document with hashed password
    const add = await new IndustryUserMaster({
      UserGroupCategory,
      IndustryCategory,
      Name,
      Email,
      Mobile,
      landLine,
      UserName,
      Password, // Use hashed password here
      Address,
      IsActive,
      productImage, // Include productImage if needed
    }).save();

    // Send successful response
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    // Log error and send error response
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listIndustryUserMasterDetails = async (req, res) => {
  try {
    const list = await IndustryUserMaster.find().sort({ Name: 1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listIndustryUserMasterByCategory = async (req, res) => {
  try {
    const list = await IndustryUserMaster.find({
      UserGroupCategory: req.params.UserGroupCategoryId,
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
exports.listIndustryUserMasterDetailsByParams = async (req, res) => {
  try {
    console.log("ayo ai");
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "industries", // The collection name of IndustryCategory
          localField: "IndustryCategory", // The field in IndustryUserMaster that references IndustryCategory
          foreignField: "_id", // The field in IndustryCategory that is matched against
          as: "Indus", // The alias for the joined data
        },
      },
      {
        $lookup: {
          from: "usergroupmasters", // The collection name of UserGroupCategory
          localField: "UserGroupCategory", // The field in IndustryUserMaster that references UserGroupCategory
          foreignField: "_id", // The field in UserGroupCategory that is matched against
          as: "usegr", // The alias for the joined data
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
      sort[sorton] = sortdir === "desc" ? -1 : 1;
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

    const list = await IndustryUserMaster.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};


exports.updateIndustryUserMasterDetails = async (req, res) => {
  try {
    let productImage = req.file
      ? `uploads/IndustryUserMaster/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (productImage != null) {
      fieldvalues.productImage = productImage;
    }

    const update = await IndustryUserMaster.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,

      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeIndustryUserMasterDetails = async (req, res) => {
  try {
    const del = await IndustryUserMaster.deleteOne({
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

//     const list = await IndustryUserMaster.find({
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


//login user

exports.loginUser = async (req, res) => {
  const { UserName, Password } = req.body;

  try {
    // Find the user by UserName
    const user = await IndustryUserMaster.findOne({ UserName });

    if (!user) {
      return res.json({ success: false, message: "User Doesn't Exist!" });
    }

    // Compare the provided plain-text password with the stored hashed password
    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    // Generate a token (assuming createToken is a function you have to create a JWT)
    const token = createToken(user._id);

    // Return success response with the token
     res.json({ success: true, token });
  } catch (error) {
    // Log any errors that occur and send a general error response
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};