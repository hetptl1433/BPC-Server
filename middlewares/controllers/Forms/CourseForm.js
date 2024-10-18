
const CourseForm = require("../../models/Forms/CourseForm");

exports.createCourseForm = async (req, res) => {
  try {
    const {
      CourseName,
      CompanyName,
      ContactPerson, 
      Email,
      Mobile,
      
    } = req.body;

    
    // Add more as needed

    const addCourseForm = await new CourseForm({
      CourseName,
      CompanyName,
      ContactPerson, 
      Email,
      Mobile,
    }).save();

    res.status(200).json({ isOk: true, data: addCourseForm, message: "" });
  } catch (err) {
    res
      .status(200)
      .json({ isOk: false, message: "Error creating Contact Form" });
  }
};


exports.getCourseForm = async (req, res) => {
  try {
    const find = await CourseForm.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listCourseForm = async (req, res) => {
  try {
    const list = await CourseForm.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveCourseForm = async (req, res) => {
  try {
    const list = await CourseForm.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listCourseFormByParams = async (req, res) => {
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

    const list = await CourseForm.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateCourseForm= async (req, res) => {
  try {
    const update = await CourseForm.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeCourseForm = async (req, res) => {
  try {
    console.log("wqd");
    const delTL = await CourseForm.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
