
const PointMaster = require("../../models/PointMaster/PointMaster");


////////////////////////////////////////PointMaster//////////////////////////////////////////
exports.listPointMaster = async (req, res) => {
  try {
    const list = await PointMaster.find().sort({ PointMasterName: 1 }).exec();
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send("list PointMaster failed");
  }
};

exports.listPointMasterByParams = async (req, res) => {
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
              PointMasterName: new RegExp(match, "i"),
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

    const list = await PointMaster.aggregate(query);
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send("list all PointMaster failed");
  }
};


exports.removePointMaster = async (req, res) => {
  try {
    const del = await PointMaster.findOneAndDelete({
      _id: req.params._id,
    });
    console.log(del);
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete PointMaster failed");
  }
};

exports.getPointMaster = async (req, res) => {
  try {
    const state = await PointMaster.findOne({ _id: req.params._id }).exec();
    console.log("get PointMaster", state);
    res.json(state);
  } catch (error) {
    console.log(error);
    res.status(400).send("get PointMaster failed");
  }
};

exports.createPointMaster = async (req, res) => {
  try {
    console.log(req.body);
    // const code = await PointMaster.findOne({ PointMasterCode: req.body.PointMasterCode });
    const PointMasterName = await PointMaster.findOne({ PointMasterName: req.body.PointMasterName });
    if (PointMasterName) {
      return res.status(200).json({
        isOk: false,
        field: 1,
        message: "PointMaster with this name already exists!",
      });
    }
    // else if (code) {
    //   return res
    //     .status(200)
    //     .json({
    //       isOk: false,
    //       field: 2,
    //       message: "PointMaster with this code already exists!",
    //     });
    // }
    else {
      const addPointMaster = await new PointMaster(req.body).save();
      console.log("create PointMaster", addPointMaster);
      res.status(200).json({ isOk: true, data: addPointMaster });
    }
  } catch (err) {
    console.log("log error from create PointMaster", err);
    return res.status(400).send("create dynamic content failed");
  }
};

exports.updatePointMaster = async (req, res) => {
  try {
    const update = await PointMaster.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    console.log("edit PointMaster", update);
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update PointMaster failed");
  }
};

exports.removeAndUpdatePointMaster = async (req, res) => {
  try {
    const update = await PointMaster.findOneAndUpdate(
      { _id: req.params._id },
      { isActive: false },
      { new: true }
    );
    console.log(update);
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("remove PointMaster failed");
  }
};
