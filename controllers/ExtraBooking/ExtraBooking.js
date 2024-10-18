const ExtraBooking = require("../../models/ExtraBooking/ExtraBooking");

exports.createExtraBooking = async (req, res) => {
  try {
    const { Name, Price, SortOrder } = req.body;
    const addExtraBooking = await new ExtraBooking(req.body).save();
    console.log("create Extra Booking", addExtraBooking);
    res.status(200).json({ isOk: true, data: addExtraBooking, message: "" });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error creating Extra Booking" });
  }
};

exports.getExtraBooking = async (req, res) => {
  try {
    const find = await ExtraBooking.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listExtraBooking = async (req, res) => {
  try {
    const list = await ExtraBooking.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveExtraBooking = async (req, res) => {
  try {
    const list = await ExtraBooking.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    console.log("list active social", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listExtraBookingByParams = async (req, res) => {
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
        $addFields: {
          priceStr: { $toString: "$Price" }, // Convert Price to string
        },
      },
      {
        $match: {
          $or: [
            {
              Name: { $regex: match, $options: "i" }, // Regex for Name
            },
            {
              priceStr: { $regex: match, $options: "i" }, // Regex for converted Price string
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

    const list = await ExtraBooking.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateExtraBooking = async (req, res) => {
  try {
    const update = await ExtraBooking.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeExtraBooking = async (req, res) => {
  try {
    const delTL = await ExtraBooking.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
