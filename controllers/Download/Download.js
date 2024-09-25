const DownloadFiles = require("../../models/Download/Download");
const fs = require("fs");

exports.listDownloadFiles = async (req, res) => {
  try {
    const list = await DownloadFiles.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
exports.listActiveDownloadFiles = async (req, res) => {
  try {
    const list = await DownloadFiles.find({ IsActive: true })
      .sort({ SortOrder: 1 }) // 1 for ascending, -1 for descending
      .exec();
    console.log("list Active DownloadFile", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};
  

exports.createDownloadFiles = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/DownloadFile`)) {
      fs.mkdirSync(`${__basedir}/uploads/DownloadFile`);
    }

    let DownloadFile = req.file
      ? `uploads/DownloadFile/${req.file.filename}`
      : null;

    let { Title, SortOrder, IsActive } = req.body;

    const add = await new DownloadFiles({
      Title,
      
      DownloadFile,
      SortOrder,
      IsActive,
    }).save();
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ isOk: false, message: err });
  }
};

exports.listDownloadFilesByParams = async (req, res) => {
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

    const list = await DownloadFiles.aggregate(query);
    res.json(list);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.removeDownloadFiles = async (req, res) => {
  try {
    const del = await DownloadFiles.findOneAndDelete({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

exports.getDownloadFiles = async (req, res) => {
  try {
    const state = await DownloadFiles.findOne({ _id: req.params._id }).exec();
    res.json(state);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateDownloadFiles = async (req, res) => {
  try {
    let DownloadFile = req.file
      ? `uploads/DownloadFile/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (DownloadFile != null) {
      fieldvalues.DownloadFile = DownloadFile;
    }
    const update = await DownloadFiles.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,

      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(500).send(err);
  }
};
