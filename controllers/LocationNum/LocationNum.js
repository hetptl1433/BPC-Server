const LocationNum = require("../../models/LocationNum/LocationNum");
exports.createLocationNum = async (req, res) => {
  try {
    const { Name, Code, ShortName , IsActive } = req.body;
    const addLocationNum = await new LocationNum(req.body).save();
    console.log("create LocationNum", addLocationNum);
    res.status(200).json({ isOk: true, data: addLocationNum, message: "" });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error creating Location" });
  }
};

exports.getLocationNum = async (req, res) => {
  try {
    const find = await LocationNum.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listLocationNum = async (req, res) => {
  try {
    const list = await LocationNum.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveLocationNum = async (req, res) => {
  try {
    const list = await LocationNum.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    console.log("list avi", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listLocationNumByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
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
                LocationNum: { $regex: match, $options: "i" },
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

    const list = await LocationNum.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateLocationNumMaster = async (req, res) => {
  try {
    const update = await LocationNum.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeLocationNumMaster = async (req, res) => {
  try {
    const delTL = await LocationNum.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
