const PopUpFile = require("../../models/PopUp/PopUp");
const fs = require("fs");

exports.listPopUpFile = async (req, res) => {
  try {
    const list = await PopUpFile.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
exports.listActivePopUpFile = async (req, res) => {
 try {
   const list = await PopUpFile.find({ IsActive: true })
     .sort({ createdAt: -1 })
     .exec();
   console.log("list Active PopUpFile", list);
   res.json(list);
 } catch (error) {
   return res.status(400).send(error);
 }
};

exports.createPopUpFile = async (req, res) => {
  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(`${__basedir}/uploads/PopUpFile`)) {
      fs.mkdirSync(`${__basedir}/uploads/PopUpFile`);
    }

    // Store file path if file is uploaded
    let uploadedFilePath = req.file
      ? `uploads/PopUpFile/${req.file.filename}`
      : null;

    // Destructure request body
    let { Title, SortOrder, IsActive } = req.body;

    // Create new document using the PopUpFile model
    const add = await new PopUpFile({
      Title,
      PopUpFile: uploadedFilePath, // Use the new variable name
      SortOrder,
      IsActive,
    }).save();

    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ isOk: false, message: err });
  }
};

exports.listPopUpFileByParams = async (req, res) => {
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

    const list = await PopUpFile.aggregate(query);
    res.json(list);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.removePopUpFile = async (req, res) => {
  try {
    const del = await PopUpFile.findOneAndDelete({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

exports.getPopUpFile = async (req, res) => {
  try {
    const state = await PopUpFile.findOne({ _id: req.params._id }).exec();
    res.json(state);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updatePopUpFile = async (req, res) => {
  try {
    let PopUpFile = req.file
      ? `uploads/PopUpFile/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (PopUpFile != null) {
      fieldvalues.PopUpFile = PopUpFile;
    }
    const update = await PopUpFile.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,

      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(500).send(err);
  }
};
