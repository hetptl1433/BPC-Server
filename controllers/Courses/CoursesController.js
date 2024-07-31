
const CoursesFun = require("../../models/Courses/CoursesModal");

exports.createCoursesFun = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const {
      Name,
      Duration,
      Timing,
      Eligibility,
      Fees,
      SortOrder,
      Desc,
      IsActive,
    } = req.body;
    const addCoursesFun = await new CoursesFun({ Name, Duration, Timing , Eligibility, Fees, SortOrder, Desc , IsActive }).save();
    console.log("create Courses", addCoursesFun);
    res.status(200).json({ isOk: true, data: addCoursesFun, message: "" });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error creating BPC Courses" });
  }
};

exports.getCoursesFun = async (req, res) => {
  try {
    const find = await CoursesFun.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listCoursesFun = async (req, res) => {
  try {
    const list = await CoursesFun.find().sort({ createdAt: 1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveCoursesFun = async (req, res) => {
  try {
    const list = await CoursesFun.find({ IsActive: true })
      .sort({ createdAt: 1 })
      .exec();
    console.log("list active Courses", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listCoursesFunByParams = async (req, res) => {
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

    const list = await CoursesFun.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateCoursesFunMaster = async (req, res) => {
  try {
    const update = await CoursesFun.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeCoursesFunMaster = async (req, res) => {
  try {
    const delTL = await CoursesFun.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
