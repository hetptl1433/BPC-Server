
const Content = require("../../models/Content/Content");

exports.createContent = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { Title, subTitle, Desc, IsActive } = req.body;
    const addContent = await new Content({ Title, subTitle, Desc,  IsActive }).save();
    console.log("create Content", addContent);
    res.status(200).json({ isOk: true, data: addContent, message: "" });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error creating youtube description" });
  }
};

exports.getContent = async (req, res) => {
  try {
    const find = await Content.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    console.log("err",error)
    return res.status(500).send(error);
  }
};
exports.getContentBySubTitle = async (req, res) => {
 try {
  console.log(req.params.subTitle);
    const find = await Content.findOne({ subTitle: req.params.subTitle }).exec();
    res.json(find);
  } catch (error) {
    console.log("err",error)
    return res.status(500).send(error);
  }
};


exports.listContent = async (req, res) => {
  try {
    const list = await Content.find().sort({ createdAt: 1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveContent = async (req, res) => {
  try {
    const list = await Content.find({ IsActive: true })
      .sort({ createdAt: 1 })
      .exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listContentByParams = async (req, res) => {
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

    const list = await Content.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateContentMaster = async (req, res) => {
  try {
    const update = await Content.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeContentMaster = async (req, res) => {
  try {
    const delTL = await Content.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
