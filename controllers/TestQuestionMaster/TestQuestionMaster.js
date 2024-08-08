
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
        $match: { isActive: isActive },
      },
      {
        $lookup: {
          from: "testcats", // Collection name for TestCat
          localField: "TestCategoryID",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "testcatmasters", // Collection name for TestCatMaster
          localField: "TestMasterID",
          foreignField: "_id",
          as: "TestNameDetails",
        },
      },
      {
        $unwind: {
          path: "$TestNameDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            {
              TestQuestionMasterName: new RegExp(match, "i"),
            },
            {
              "TestNameDetails.TestName": new RegExp(match, "i"),
            },
            {
              "categoryDetails.categoryName": new RegExp(match, "i"),
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

    const list = await TestQuestionMaster.aggregate(query);
    console.log("list TestQuestionMaster by params", list);
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send("list all TestQuestionMaster failed");
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
    if (TestQuestionMasterName) {
      return res.status(200).json({
        isOk: false,
        field: 1,
        message: "TestQuestionMaster with this name already exists!",
      });
    }
    // else if (code) {
    //   return res
    //     .status(200)
    //     .json({
    //       isOk: false,
    //       field: 2,
    //       message: "TestQuestionMaster with this code already exists!",
    //     });
    // }
    else {
      const addTestQuestionMaster = await new TestQuestionMaster(req.body).save();
      console.log("create TestQuestionMaster", addTestQuestionMaster);
      res.status(200).json({ isOk: true, data: addTestQuestionMaster });
    }
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
