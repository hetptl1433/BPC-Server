const ExtraBookingDetails = require("../../models/ExtraBookingDetails/ExtraBookingDetails");
exports.createExtraBookingDetails = async (req, res) => {
  try {

    console.log(req.body);
    const addExtraBookingDetails = await new ExtraBookingDetails(req.body).save();
    console.log("create ExtraBookingDetails", addExtraBookingDetails);
    res
      .status(200)
      .json({
        isOk: true,
        data: addExtraBookingDetails,
        message: addExtraBookingDetails,
      });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error creating ExtraBookingDetails" });
  }
};

exports.getExtraBookingDetails = async (req, res) => {
  try {
    const find = await ExtraBookingDetails.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};
exports.getExtraBookingDetailsById = async (req, res) => {
  try {
    
    const find = await ExtraBookingDetails.find({
      OrderId: req.params._id,
    }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listExtraBookingDetails = async (req, res) => {
  try {
    const list = await ExtraBookingDetails.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveExtraBookingDetails = async (req, res) => {
  try {
    const list = await ExtraBookingDetails.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    console.log("list avi", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listExtraBookingDetailsByParams = async (req, res) => {
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
                ExtraBookingDetails: { $regex: match, $options: "i" },
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

    const list = await ExtraBookingDetails.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateExtraBookingDetailsMaster = async (req, res) => {
  try {
    const update = await ExtraBookingDetails.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeExtraBookingDetailsMaster = async (req, res) => {
  try {
    const delTL = await ExtraBookingDetails.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
