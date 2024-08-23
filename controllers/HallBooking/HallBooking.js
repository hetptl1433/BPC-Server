const fs = require("fs");
const HallBook = require("../../models/HallBooking/HallBooking");

exports.listHallBook = async (req, res) => {
  try {
    const list = await HallBook.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.createHallBook = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/HallBookImg`)) {
      fs.mkdirSync(`${__basedir}/uploads/HallBookImg`);
    }

    let Icon = req.file
      ? `uploads/HallBookImg/${req.file.filename}`
      : null;

   let {
     Name,
     Desc,
     HalfDayCapacity,
     HalfDayBasicValue,
     HalfDayCentralGST,
     HalfDayStateGST,
     HalfDayTotal,
     FullDayCapacity,
     FullDayBasicValue,
     FullDayCentralGST,
     FullDayStateGST,
     FullDayTotal,
     SortOrder,
     IsActive,
   } = req.body;

    const add = await new HallBook({
      Name,
      Desc,
      HalfDayCapacity,
      HalfDayBasicValue,
      HalfDayCentralGST,
      HalfDayStateGST,
      HalfDayTotal,
      FullDayCapacity,
      FullDayBasicValue,
      FullDayCentralGST,
      FullDayStateGST,
      FullDayTotal,
      SortOrder,
      Icon,
      IsActive,
    }).save();
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ isOk: false, message: err });
  }
};

exports.listHallBookByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },

      {
        $match: {
          $or: [
            {
              Name: new RegExp(match, "i"),
            }
           
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
      sort[sorton] = sortdir == "Desc" ? -1 : 1;
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

    const list = await HallBook.aggregate(query);
    res.json(list);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.removeHallBook  = async (req, res) => {
  try {
    const del = await HallBook.deleteOne({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

exports.getHallBook  = async (req, res) => {
  try {
    const state = await HallBook.findOne({ _id: req.params._id }).exec();
    res.json(state);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateHallBook = async (req, res) => {
  try {
    let Icon = req.file
      ? `uploads/HallBookImg/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (Icon != null) {
      fieldvalues.Icon = Icon;
    }
    const update = await HallBook.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,

      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(500).send(err);
  }
};
