const RASData = require("../../models/RASData/RASData");

exports.getRASDataDetails = async (req, res) => {
  try {
    const find = await RASData.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createRASDataDetails = async (req, res) => {
  try {
    let {
      EmailID,
      Name,
      Frequency,
      Remarks,
      TimeperFrequency,
      IsActive,
    } = req.body;

    const add = await new RASData({
      EmailID,
      Name,
      Frequency,
      Remarks,
      TimeperFrequency,
      IsActive,
    }).save();

    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
// exports.listRASDataDetails = async (req, res) => {
//   try {
//     const list = await RASData.find().sort({ NameActivity: 1 }).exec();
//     res.json(list);
//   } catch (error) {
//     return res.status(400).send(error);
//   }
// };

exports.listRASDataDetails = async (req, res) => {
  try {
    const list = await RASData.find()
      .populate("RefEmailID") // Populates the RefEmpCode field with the related RAS document
      .sort({ Name: 1 })
      .exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};
exports.listRASDataByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "ras", // Reference to the "ras" collection
          localField: "EmailID",
          foreignField: "_id",
          as: "rasData",
        },
      },
      {
        $unwind: {
          path: "$rasData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            {
              NameActivity: { $regex: match, $options: "i" },
            },
            {
              "rasData.EmpCode": { $regex: match, $options: "i" },
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

    const list = await RASData.aggregate(query);
    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateRASDataDetails = async (req, res) => {
  try {
    const update = await RASData.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeRASDataDetails = async (req, res) => {
  try {
    const del = await RASData.deleteOne({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};
