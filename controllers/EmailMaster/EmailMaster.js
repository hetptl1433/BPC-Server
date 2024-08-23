
const EmailMaster = require("../../models/EmailMaster/EmailMaster");

exports.createEmailMaster = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const {
      MailerName,
      Email,
      Password,
      OutgoingServer,
      outgoingPort,
      SSLTYpe,
      IsActive,
    } = req.body;
    const addEmailMaster = await new EmailMaster({
      MailerName,
      Email,
      Password,
      OutgoingServer,
      outgoingPort,
      SSLType,
      IsActive,
    }).save();
    console.log("create EmailMaster", addEmailMaster);
    res.status(200).json({ isOk: true, data: addEmailMaster, message: "" });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error creating Email" });
  }
};

exports.getEmailMaster = async (req, res) => {
  try {
    const find = await EmailMaster.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listEmailMaster = async (req, res) => {
  try {
    const list = await EmailMaster.find().sort({ createdAt: 1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveEmailMaster = async (req, res) => {
  try {
    const list = await EmailMaster.find({ IsActive: true })
      .sort({ createdAt: 1 })
      .exec();
    console.log("list active EmailMaster", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listEmailMasterByParams = async (req, res) => {
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

    const list = await EmailMaster.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateEmailMasterMaster = async (req, res) => {
  try {
    const update = await EmailMaster.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeEmailMasterMaster = async (req, res) => {
  try {
    const delTL = await EmailMaster.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
