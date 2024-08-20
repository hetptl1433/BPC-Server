
const ContentContact = require("../../models/ContentContact/ContentContact");

exports.createContentContact = async (req, res) => {
  try {
    const { Name, Email, Designation, SortOrder } = req.body;
    const addContentContact = await new ContentContact(req.body).save();
    console.log("create ContentContact", addContentContact);
    res.status(200).json({ isOk: true, data: addContentContact, message: "" });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error creating ContentContact" });
  }
};

exports.getContentContact = async (req, res) => {
  try {
    const find = await ContentContact.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listContentContact = async (req, res) => {
  try {
    const list = await ContentContact.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveContentContact = async (req, res) => {
  try {
    const list = await ContentContact.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    console.log("list ContentContact", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listContentContactByParams = async (req, res) => {
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
                vision: { $regex: match, $options: "i" },
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

    const list = await ContentContact.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateContentContact= async (req, res) => {
  try {
    const update = await ContentContact.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeContentContact = async (req, res) => {
  try {
    const delTL = await ContentContact.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
