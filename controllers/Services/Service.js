const fs = require("fs");
const service = require("../../models/Services/Service");
const { log } = require("console");

exports.listImgages = async (req, res) => {
  try {
    const list = await service.find().sort({ sortOrder: 1 }).exec();
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};


exports.createImages = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/ServiceImg`)) {
      fs.mkdirSync(`${__basedir}/uploads/ServiceImg`);
    }

    let image = req.file ? `uploads/ServiceImg/${req.file.filename}` : null;
    let { name, shortdesc, desc, sortOrder, IsActive } = req.body;

    const add = new service({
      name,
      shortdesc,
      desc,
      image,
      sortOrder,
      IsActive,
    });

    await add.save();
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    log("error", err);
    res.status(500).json({ isOk: false, message: err.message });
  }
};

exports.listImagesByParams = async (req, res) => {
    
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
              name: new RegExp(match, "i"),
            },
            {
                image: new RegExp(match, "i"),
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

    const list = await service.aggregate(query);
    
    res.json(list);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.removeImages  = async (req, res) => {
  try {
    const del = await service.deleteOne({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

exports.getImages  = async (req, res) => {
  try {
    const state = await service.findOne({ _id: req.params._id }).exec();
    res.json(state);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateImages = async (req, res) => {
  try {
    let image = req.file
      ? `uploads/ServiceImg/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (image != null) {
      fieldvalues.image = image;
    }
    const update = await service.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,

      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(500).send(err);
  }
};
