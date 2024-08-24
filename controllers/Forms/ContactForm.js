
const ContactForm = require("../../models/Forms/ContactForm");

exports.createContactForm = async (req, res) => {
  try {
   const {
     Name,
     email,
     Mobile,
     Company,
     City,
     Services,
     Help,
     HereFrom,
     KnowMore,
     IsActive,
   } = req.body;

    const addContactForm = await new ContactForm(req.body).save();
    console.log("create contact us detail", addContactForm);
    res.status(200).json({ isOk: true, data: addContactForm, message: "" });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error creating ContactForm" });
  }
};

exports.getContactForm = async (req, res) => {
  try {
    const find = await ContactForm.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listContactForm = async (req, res) => {
  try {
    const list = await ContactForm.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveContactForm = async (req, res) => {
  try {
    const list = await ContactForm.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    console.log("list ContactForm", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listContactFormByParams = async (req, res) => {
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

    const list = await ContactForm.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateContactForm= async (req, res) => {
  try {
    const update = await ContactForm.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeContactForm = async (req, res) => {
  try {
    const delTL = await ContactForm.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
