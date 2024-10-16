const ResultData = require("../../models/ResultData/ResultData");

exports.createResultData = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const addResultData = await new ResultData(
      req.body
    ).save();
    console.log("create ResultData", addResultData);
    res.status(200).json({ isOk: true, data: addResultData, message: "" });
  } catch (err) {
    res
      .status(200)
      .json({ isOk: false, message: "Error creating ResultData description" });
  }
};

exports.getResultData = async (req, res) => {
  try {
    const find = await ResultData.findOne({ _id: req.params._id })
      .populate("userId") // Populate the userId field with data from IndustryUserMaster
      .populate("id") // Populate the id field with data from TestCatMaster
      .exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.getResultDataOfUser = async (req, res) => {
  try {
    const { userId, id } = req.params;

    // Check if result data exists
    const find = await ResultData.findOne({ userId, id }).exec();

    if (!find) {
      // If no data is found, return 404 status
      return res
        .status(404)
        .json({ message: "No result data found for this user and id" });
    }

    // Return the found data
    res.json(find);
  } catch (error) {
    // If an error occurs, return 500 status with error message
    return res.status(500).json({ message: "Server error", error });
  }
};


exports.listResultData = async (req, res) => {
  try {
    const list = await ResultData.find().sort({ createdAt: 1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveResultData = async (req, res) => {
  try {
    const list = await ResultData.find({ IsActive: true })
      .sort({ createdAt: 1 })
      .exec();
    console.log("list active ResultData", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const mongoose = require("mongoose");

exports.listResultDataByParams = async (req, res) => {
  try {
    let {
      skip = 0,
      per_page = 10,
      sorton,
      sortdir,
      match,
      IsActive,
    } = req.body;

    const { tid } = req.params; // tid will be a string

    let query = [
      {
        $match: {
          IsActive: IsActive,
        },
      },
      {
        $addFields: {
          idAsString: { $toString: "$id" }, // Convert the ObjectId `id` to a string
        },
      },
      {
        $match: {
          idAsString: tid, // Match `id` as string with `tid`
        },
      },
      {
        $lookup: {
          from: "industryusermasters",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $lookup: {
          from: "testcatmasters",
          localField: "id",
          foreignField: "_id",
          as: "testDetails",
        },
      },
      {
        $unwind: "$testDetails",
      },
      {
        $lookup: {
          from: "industries",
          let: {
            industryCategory: { $toObjectId: "$userDetails.IndustryCategory" },
          },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$industryCategory"] } } },
          ],
          as: "industryDetails",
        },
      },
      {
        $unwind: {
          path: "$industryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (match) {
      query.push({
        $match: {
          $or: [
            { "testDetails.TestName": { $regex: match, $options: "i" } },
            { "industryDetails.Name": { $regex: match, $options: "i" } },
          ],
        },
      });
    }

    query.push(
      {
        $facet: {
          stage1: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
          stage2: [{ $skip: skip }, { $limit: per_page }],
        },
      },
      { $unwind: { path: "$stage1" } },
      {
        $project: {
          count: "$stage1.count",
          data: "$stage2",
        },
      }
    );

    let sort = {};
    if (sorton && sortdir) {
      sort[sorton] = sortdir === "desc" ? -1 : 1;
    } else {
      sort["createdAt"] = -1;
    }
    query = [{ $sort: sort }].concat(query);

    const list = await ResultData.aggregate(query);

    res.json(list);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};








exports.updateResultDataMaster = async (req, res) => {
  try {
    const update = await ResultData.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeResultDataMaster = async (req, res) => {
  try {
    const delTL = await ResultData.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};


