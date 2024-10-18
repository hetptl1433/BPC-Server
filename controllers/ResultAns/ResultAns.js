const ResultAns = require("../../models/ResultAns/ResultAns");
const PointMaster = require("../../models/PointMaster/PointMaster");
const mongoose = require("mongoose");

const getPointMaster = async (id) => {
  try {
    const state = await PointMaster.findOne({
      _id: id,
    }).exec();
    console.log("get PointMaster", state);
    return(state);
  } catch (error) {
    console.log(error);
  }
};

exports.createResultAns = async (req, res) => {
  try {
    const resultData = req.body; // Expecting an array of result entries
    console.log("Received request body:", resultData);

    // Check if resultData is an array and contains entries
    if (!Array.isArray(resultData) || resultData.length === 0) {
      return res
        .status(400)
        .json({ isOk: false, message: "Invalid input data" });
    }

    // Loop through each result entry and handle pointMasterId
    const updatedResultData = await Promise.all(
      resultData.map(async (entry) => {
        // If pointMasterId is missing or invalid, set PointMasterPoints to "0"
        if (
          !entry.pointMasterId ||
          !mongoose.Types.ObjectId.isValid(entry.pointMasterId)
        ) {
          console.warn("Missing or invalid pointMasterId in entry:", entry);
          return {
            ...entry,
            PointMasterPoints: "0", // Default value when pointMasterId is invalid/missing
          };
        }

        try {
          // Attempt to fetch PointMaster data
          const pointMaster = await getPointMaster(entry.pointMasterId);
          return {
            ...entry,
            PointMasterPoints: pointMaster
              ? pointMaster.PointMasterPoints
              : "0", // Default if no PointMaster data found
          };
        } catch (error) {
          // Log error and proceed with PointMasterPoints set to "0"
          console.error(
            `Error fetching PointMaster for id ${entry.pointMasterId}:`,
            error.message
          );
          return {
            ...entry,
            PointMasterPoints: "0", // Default in case of any fetch error
          };
        }
      })
    );

    // Use insertMany to save all updated results, even if some entries had issues
    const addedResultAns = await ResultAns.insertMany(updatedResultData);

    console.log("ResultAns created:", addedResultAns);

    res.status(200).json({
      isOk: true,
      data: addedResultAns,
      message:
        "Result saved successfully, with default points for some entries",
    });
  } catch (err) {
    console.error("Error creating ResultAns:", err.message, err.stack);
    res.status(500).json({ isOk: false, message: "Error creating ResultAns" });
  }
};






exports.getResultAns = async (req, res) => {
  try {
    const find = await ResultAns.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listResultAns = async (req, res) => {
  try {
    const list = await ResultAns.find().sort({ createdAt: 1 }).exec();
    
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveResultAns = async (req, res) => {
  try {
    const list = await ResultAns.find({ IsActive: true })
      .sort({ createdAt: 1 })
      .exec();
    console.log("list active ResultAns", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listResultAnsByParams = async (req, res) => {
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

    const list = await ResultAns.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateResultAnsMaster = async (req, res) => {
  try {
    const update = await ResultAns.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeResultAnsMaster = async (req, res) => {
  try {
    const delTL = await ResultAns.deleteOne({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};


exports.getResultAnsAndData = async (req, res) => {
  
  try {
    const find = await ResultAns.find({
      userId: req.params.userID,
      id: req.params.testID,
    })
      .populate("pointMasterId") // Populates the PointMaster data
      .exec();
    console.log("yeveto", find);
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};
