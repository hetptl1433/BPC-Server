
const Industry = require("../../models/Industry/Industry");

exports.createIndustry = async (req, res) => {
  try {
    const { Name, Email, Address } = req.body;
    const addIndustry = await new Industry(req.body).save();
    console.log("create Name Email Address", addIndustry);
    res.status(200).json({ isOk: true, data: addIndustry, message: "" });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error creating Name Email" });
  }
};

exports.getIndustry = async (req, res) => {
  try {
    const find = await Industry.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listIndustry = async (req, res) => {
  try {
    const list = await Industry.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveIndustry = async (req, res) => {
  try {
    const list = await Industry.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    console.log("list Name Email", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listIndustryByParams = async (req, res) => {
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
                Name: { $regex: match, $options: "i" },
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

    const list = await Industry.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateIndustry= async (req, res) => {
  try {
    const update = await Industry.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeIndustry = async (req, res) => {
  try {
    const delTL = await Industry.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
