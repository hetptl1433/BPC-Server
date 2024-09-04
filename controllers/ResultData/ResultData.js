const ResultData = require("../../models/ResultData/ResultData");

exports.createResultData = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const addResultData = await new ResultData(
      req.body
    ).save();
    console.log("create ResultData", addResultData);
    res.status(200).json({ isOk: true, data: addResultData, message: "" });
  } catch (err) {
    res
      .status(200)
      .json({ isOk: false, message: "Error creating ResultData description" });
  }
};

exports.getResultData = async (req, res) => {
  try {
    const find = await ResultData.findOne({ _id: req.params._id })
      .populate("userId") // Populate the userId field with data from IndustryUserMaster
      .populate("id") // Populate the id field with data from TestCatMaster
      .exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listResultData = async (req, res) => {
  try {
    const list = await ResultData.find().sort({ createdAt: 1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveResultData = async (req, res) => {
  try {
    const list = await ResultData.find({ IsActive: true })
      .sort({ createdAt: 1 })
      .exec();
    console.log("list active ResultData", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listResultDataByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "industryusermasters", // Collection name for IndustryUserMaster
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $lookup: {
          from: "testcatmasters", // Collection name for TestCatMaster
          localField: "id",
          foreignField: "_id",
          as: "testDetails",
        },
      },
      {
        $unwind: "$testDetails",
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
                Title: { $regex: match, $options: "i" },
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

    const list = await ResultData.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};


exports.updateResultDataMaster = async (req, res) => {
  try {
    const update = await ResultData.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeResultDataMaster = async (req, res) => {
  try {
    const delTL = await ResultData.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};


