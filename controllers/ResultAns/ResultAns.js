const ResultAns = require("../../models/ResultAns/ResultAns");

exports.createResultAns = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const addResultAns = await new ResultAns(
      req.body
    ).save();
    console.log("create ResultAns", addResultAns);
    res.status(200).json({ isOk: true, data: addResultAns, message: "" });
  } catch (err) {
    res
      .status(200)
      .json({ isOk: false, message: "Error creating ResultAns description" });
  }
};

exports.getResultAns = async (req, res) => {
  try {
    const find = await ResultAns.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listResultAns = async (req, res) => {
  try {
    const list = await ResultAns.find().sort({ createdAt: 1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveResultAns = async (req, res) => {
  try {
    const list = await ResultAns.find({ IsActive: true })
      .sort({ createdAt: 1 })
      .exec();
    console.log("list active ResultAns", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listResultAnsByParams = async (req, res) => {
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

    const list = await ResultAns.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateResultAnsMaster = async (req, res) => {
  try {
    const update = await ResultAns.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeResultAnsMaster = async (req, res) => {
  try {
    const delTL = await ResultAns.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};


exports.getResultAnsAndData = async (req, res) => {
  try {
    const find = await ResultAns.find({
      userId: req.params.userID,
      id: req.params.testID,
    }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};