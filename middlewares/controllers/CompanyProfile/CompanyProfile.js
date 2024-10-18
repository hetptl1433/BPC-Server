const CompanyProfile = require("../../models/CompanyProfile/CompanyProfile");
const fs = require("fs");

exports.getCompanyProfileDetails = async (req, res) => {
  try {
    const find = await CompanyProfile.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createCompanyProfileDetails = async (req, res) => {
  try {

    console.log("ferwsfgew");
    if (!fs.existsSync(`${__basedir}/uploads/CompanyProfile`)) {
      fs.mkdirSync(`${__basedir}/uploads/CompanyProfile`);
    }

    let productImage = req.file
      ? `uploads/CompanyProfile/${req.file.filename}`
      : null;

    let {
      CompanyName,
      Email,
      SalesEmail,
      SupportEmail,
      PartnerEmail,
      Address,
      PhoneOff1,
      PhoneOff2,
      MobileOne1,
      MobileOne2,
      IsActive,
    } = req.body;

    const add = await new CompanyProfile({
      CompanyName,
      Email,
      SalesEmail,
      SupportEmail,
      PartnerEmail,
      Address,
      PhoneOff1,
      PhoneOff2,
      MobileOne1,
      MobileOne2,
      productImage,
      IsActive,
    }).save();
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listCompanyProfileDetails = async (req, res) => {
  try {
    const list = await CompanyProfile.find().sort({ CompanyName: 1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listCompanyProfileByCategory = async (req, res) => {
  try {
    try {
      const list = await CompanyProfile.find().sort({ createdAt: -1 }).exec();
      res.json(list);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listCompanyProfileDetailsByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
    
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
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
   if (match) {
     query = [
       {
         $match: {
           $or: [
             {
               CompanyName: { $regex: match, $options: "i" },
             },
           ],
         },
       },
     ].concat(query);
   }

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

    const list = await CompanyProfile.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateCompanyProfileDetails = async (req, res) => {
  try {
    let productImage = req.file
      ? `uploads/CompanyProfile/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (productImage != null) {
      fieldvalues.productImage = productImage;
    }

    const update = await CompanyProfile.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,

      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeCompanyProfileDetails = async (req, res) => {
  try {
    const del = await CompanyProfile.deleteOne({
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

//     const list = await CompanyProfile.find({
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
