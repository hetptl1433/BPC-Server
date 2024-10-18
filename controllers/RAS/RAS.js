const RAS = require("../../models/RAS/RAS");

exports.createRAS = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const {
      Organization,
      EmployeeCode,
      Date,
      FullName,
      Designation,
      Department,
      Section,
      EmailID,
      MobileNo,
      Reporting,
      DOB,
      DateofJoining,
      PreviousExperience,
      Educational,
      Achievement,
      Areaofinterest,
      Problem,
      Additionalresponsibility,
      Information,
      language,
      IsActive,
    } = req.body;
    const addRAS = await new RAS({
      Organization,
      EmployeeCode,
      Date,
      FullName,
      Designation,
      Department,
      Section,
      EmailID,
      MobileNo,
      Reporting,
      DOB,
      DateofJoining,
      PreviousExperience,
      Educational,
      Achievement,
      Areaofinterest,
      Problem,
      Additionalresponsibility,
      Information,
      language,
      IsActive,
    }).save();
    res.status(200).json({ isOk: true, data: addRAS, message: "" });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error creating RAS record" });
  }
};

exports.getRAS = async (req, res) => {
  try {
    console.log("Fetching RAS record with ID:", req.params._id);
    const find = await RAS.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listRAS = async (req, res) => {
  try {
    console.log("dwa");
    const list = await RAS.find().sort({ createdAt: 1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveRAS = async (req, res) => {
  try {
    const list = await RAS.find({ IsActive: true })
      .sort({ createdAt: 1 })
      .exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listRASByParams = async (req, res) => {
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
      query.unshift({
        $match: {
          $or: [
            { Organization: { $regex: match, $options: "i" } },
            { FullName: { $regex: match, $options: "i" } },
            { Designation: { $regex: match, $options: "i" } },
            { Department: { $regex: match, $options: "i" } },
          ],
        },
      });
    }

    if (sorton && sortdir) {
      let sort = {};
      sort[sorton] = sortdir === "desc" ? -1 : 1;
      query.unshift({ $sort: sort });
    } else {
      query.unshift({ $sort: { createdAt: -1 } });
    }

    const list = await RAS.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateRAS = async (req, res) => {
  try {
    const update = await RAS.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeRAS = async (req, res) => {
  try {
    console.log("wqd");
    const delTL = await RAS.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
