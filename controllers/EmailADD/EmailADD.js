
const EmailControl = require("../../models/Emailadd/EmailADD");

exports.createEmailControl = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { Title, Email, IsActive } = req.body;
    const addEmailControl = await new EmailControl({ Title, Email,  IsActive }).save();
    console.log("create EmailControl", addEmailControl);
    res.status(200).json({ isOk: true, data: addEmailControl, message: "" });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error creating youtube description" });
  }
};

exports.getEmailControl = async (req, res) => {
  try {
    const find = await EmailControl.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listEmailControl = async (req, res) => {
  try {
    const list = await EmailControl.find().sort({ createdAt: 1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveEmailControl = async (req, res) => {
  try {
    const list = await EmailControl.find({ IsActive: true })
      .sort({ createdAt: 1 })
      .exec();
    console.log("list active EmailControl", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listEmailControlByParams = async (req, res) => {
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

    const list = await EmailControl.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateEmailControlMaster = async (req, res) => {
  try {
    const update = await EmailControl.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeEmailControlMaster = async (req, res) => {
  try {
    const delTL = await EmailControl.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
