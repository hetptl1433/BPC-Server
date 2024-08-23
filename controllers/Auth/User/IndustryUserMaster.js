const IndustryUser = require("../../../models/IndustryIndustryUserMaster/IndustryIndustryUserMaster");
const fs = require("fs");

exports.getAdminIndustryUser = async (req, res) => {
  try {
    const find = await IndustryUser.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createAdminIndustryUser = async (req, res) => {
  try {

    if (!fs.existsSync(`${__basedir}/uploads/IndustryUserImages`)) {
      fs.mkdirSync(`${__basedir}/uploads/IndustryUserImages`);
    }

    let bannerImage = req.file
      ? `uploads/IndustryUserImages/${req.file.filename}`
      : null;


      let { firstName, lastName, email,password, IsActive } = req.body;  
    const emailExists = await IndustryUser.findOne({
      email: req.body.email,
    }).exec();

    if (emailExists) {
      return res.status(200).json({
        isOk: false,
        message: "Email already exists",
      });
    } else {
      const add = await new IndustryUser({
        firstName,
        lastName,
        email,
        password,
        bannerImage,
        IsActive,
      }).save();
      res.status(200).json({ isOk: true, data: add, message: "" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listAdminIndustryUser = async (req, res) => {
  try {
    const list = await IndustryUser.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listAdminIndustryUserByParams = async (req, res) => {
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
                firstName: { $regex: match, $options: "i" },
              },
              {
                lastName: { $regex: match, $options: "i" },
              },
              {
                email: { $regex: match, $options: "i" },
              },
              {
                password: { $regex: match, $options: "i" },
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

    const list = await IndustryUser.aggregate(query);

    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.updateAdminIndustryUser = async (req, res) => {
  try {
    let bannerImage = req.file
      ? `uploads/IndustryUserImages/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (bannerImage != null) {
      fieldvalues.bannerImage = bannerImage;
    }
    const update = await IndustryUser.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeAdminIndustryUser = async (req, res) => {
  console.log(req.params._id);
  try {
    const del = await IndustryUser.deleteOne({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.IndustryUserLoginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const IndustryUsermp = await IndustryUser.findOne({ email: email }).exec();
    if (IndustryUsermp) {
      if (IndustryUsermp.password !== password) {
        return res.status(200).json({
          isOk: false,
          filed: 1,
          message: "Authentication Failed",
        });
      } else {
        res.status(200).json({
          isOk: true,
          message: "Authentication Successfull",
          data: IndustryUsermp,
        });
      }
    } else {
      res.status(200).json({
        isOk: false,
        message: "Admin IndustryUser not Found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(200).json({
      isOk: false,
      message: "An error occurred while logging in adminpanel",
    });
  }
};
