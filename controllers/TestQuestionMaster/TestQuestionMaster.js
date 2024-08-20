
const TestQuestionMaster = require("../../models/TestQuestionMaster/TestQuestionMaster");


////////////////////////////////////////TestQuestionMaster//////////////////////////////////////////
exports.listTestQuestionMaster = async (req, res) => {
  try {
    const list = await TestQuestionMaster.find().sort({ TestQuestionMasterName: 1 }).exec();
    console.log("list TestQuestionMaster", list);
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send("list TestQuestionMaster failed");
  }
};

exports.listTestQuestionMasterByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, isActive } = req.body;

    let query = [
      {
        $match: { isActive },
      },
      // Lookup for TestCategoryID to get categoryName
      {
        $lookup: {
          from: "testcats", // Name of the collection for TestCat
          localField: "TestCategoryID",
          foreignField: "_id",
          as: "TestCategoryDetails",
        },
      },
      {
        $unwind: "$TestCategoryDetails",
      },
      {
        $addFields: {
          categoryName: "$TestCategoryDetails.categoryName",
        },
      },
      // Lookup for TestMasterID to get category
      {
        $lookup: {
          from: "testcatmasters", // Name of the collection for TestCatMaster
          localField: "TestMasterID",
          foreignField: "_id",
          as: "TestMasterDetails",
        },
      },
      {
        $unwind: "$TestMasterDetails",
      },
      {
        $addFields: {
          category: "$TestMasterDetails.category",
        },
      },
    ];

    if (match) {
      const regex = new RegExp(match, "i");
      query.push({
        $match: {
          $or: [{ AnsType: regex }],
        },
      });
    }

    let sort = {};
    if (sorton && sortdir) {
      sort[sorton] = sortdir === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }
    query.push({ $sort: sort });

    query.push({
      $facet: {
        stage1: [{ $count: "count" }],
        stage2: [{ $skip: skip }, { $limit: per_page }],
      },
    });
    query.push({ $unwind: "$stage1" });
    query.push({
      $project: {
        count: "$stage1.count",
        data: "$stage2",
      },
    });

    const list = await TestQuestionMaster.aggregate(query);
    res.json(list);
  } catch (error) {
    console.log("error in list all TestQuestionMaster", error);
    res.status(400).send("list TestQuestionMaster failed");
  }
};



exports.removeTestQuestionMaster = async (req, res) => {
  try {
    const del = await TestQuestionMaster.findOneAndDelete({
      _id: req.params._id,
    });
    console.log(del);
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete TestQuestionMaster failed");
  }
};

exports.getTestQuestionMaster = async (req, res) => {
  try {
    const state = await TestQuestionMaster.findOne({ _id: req.params._id }).exec();
    console.log("get TestQuestionMaster", state);
    res.json(state);
  } catch (error) {
    console.log(error);
    res.status(400).send("get TestQuestionMaster failed");
  }
};

exports.createTestQuestionMaster = async (req, res) => {
  try {
    console.log(req.body);
    // const code = await TestQuestionMaster.findOne({ TestQuestionMasterCode: req.body.TestQuestionMasterCode });
    const TestQuestionMasterName = await TestQuestionMaster.findOne({ TestQuestionMasterName: req.body.TestQuestionMasterName });
   
    // else if (code) {
    //   return res
    //     .status(200)
    //     .json({
    //       isOk: false,
    //       field: 2,
    //       message: "TestQuestionMaster with this code already exists!",
    //     });
    // }
 
      const addTestQuestionMaster = await new TestQuestionMaster(req.body).save();
      console.log("create TestQuestionMaster", addTestQuestionMaster);
      res.status(200).json({ isOk: true, data: addTestQuestionMaster });
    
  } catch (err) {
    console.log("log error from create TestQuestionMaster", err);
    return res.status(400).send("create dynamic content failed");
  }
};

exports.updateTestQuestionMaster = async (req, res) => {
  try {
    const update = await TestQuestionMaster.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    console.log("edit TestQuestionMaster", update);
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update TestQuestionMaster failed");
  }
};

exports.removeAndUpdateTestQuestionMaster = async (req, res) => {
  try {
    const update = await TestQuestionMaster.findOneAndUpdate(
      { _id: req.params._id },
      { isActive: false },
      { new: true }
    );
    console.log(update);
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("remove TestQuestionMaster failed");
  }
};
