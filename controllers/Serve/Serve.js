const ServeFiles = require("../../models/Serve/Serve");
const fs = require("fs");

exports.listServeFiles = async (req, res) => {
  try {
    const list = await ServeFiles.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.createServeFiles = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/ServeFile`)) {
      fs.mkdirSync(`${__basedir}/uploads/ServeFile`);
    }

    let ServeFile = req.file
      ? `uploads/ServeFile/${req.file.filename}`
      : null;

    let { Title, SortOrder, IsActive } = req.body;

    const add = await new ServeFiles({
      Title,
      
      ServeFile,
      SortOrder,
      IsActive,
    }).save();
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ isOk: false, message: err });
  }
};

exports.listServeFilesByParams = async (req, res) => {
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
              Title: new RegExp(match, "i"),
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

    const list = await ServeFiles.aggregate(query);
    res.json(list);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.removeServeFiles = async (req, res) => {
  try {
    const del = await ServeFiles.findOneAndDelete({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

exports.getServeFiles = async (req, res) => {
  try {
    const state = await ServeFiles.findOne({ _id: req.params._id }).exec();
    res.json(state);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateServeFiles = async (req, res) => {
  try {
    let ServeFile = req.file
      ? `uploads/ServeFile/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (ServeFile != null) {
      fieldvalues.ServeFile = ServeFile;
    }
    const update = await ServeFiles.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,

      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(500).send(err);
  }
};
