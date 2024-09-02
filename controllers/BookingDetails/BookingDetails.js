const BookingDetails = require("../../models/BookingDetails/BookingDetails");
exports.createBookingDetails = async (req, res) => {
  try {
    const addBookingDetails = await new BookingDetails(req.body).save();
    console.log("create BookingDetails", addBookingDetails);
    res
      .status(200)
      .json({
        isOk: true,
        data: addBookingDetails,
        message: addBookingDetails,
      });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error creating BookingDetails" });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const find = await BookingDetails.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listBookingDetails = async (req, res) => {
  try {
    const list = await BookingDetails.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveBookingDetails = async (req, res) => {
  try {
    const list = await BookingDetails.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    console.log("list avi", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listBookingDetailsByParams = async (req, res) => {
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
                BookingDetails: { $regex: match, $options: "i" },
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

    const list = await BookingDetails.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateBookingDetailsMaster = async (req, res) => {
  try {
    const update = await BookingDetails.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeBookingDetailsMaster = async (req, res) => {
  try {
    const delTL = await BookingDetails.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
