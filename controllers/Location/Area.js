const AreaLoc = require("../../models/Location/Area");

exports.listAreaLoc = async (req, res) => {
  try {
    const list = await AreaLoc.find().sort({ AreaLocName: 1 }).exec();
    console.log("list AreaLoc", list);
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send("list AreaLoc failed");
  }
};

exports.listAreaLocByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, isActive } = req.body;

    let query = [
      {
        $match: { isActive: isActive },
      },
      {
        $lookup: {
          from: "countries",
          localField: "CountryID",
          foreignField: "_id",
          as: "countryname",
        },
      },
      {
        $unwind: {
          path: "$countryname",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          countryname: "$countryname.CountryName",
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "StateID",
          foreignField: "_id",
          as: "statename",
        },
      },
      {
        $unwind: {
          path: "$statename",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          statename: "$statename.StateName",
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "CityID",
          foreignField: "_id",
          as: "CityFields",
        },
      },
      {
        $unwind: {
          path: "$CityFields",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          "CityFields.CityName": "$CityFields.CityName",
        },
      },
      {
        $match: {
          $or: [
            {
              AreaLocName: new RegExp(match, "i"),
            },
            {
              StateID: new RegExp(match, "i"),
            },
            {
              countryname: new RegExp(match, "i"),
            },
            {
              statename: new RegExp(match, "i"),
            },
            {
              "CityFields.CityName": new RegExp(match, "i"),
            },
          ],
        },
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

    const list = await AreaLoc.aggregate(query);
    console.log("list AreaLoc by params", list);
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send("list all AreaLoc failed");
  }
};


exports.removeAreaLoc = async (req, res) => {
  try {
    const del = await AreaLoc.findOneAndDelete({
      _id: req.params._id,
    });
    console.log(del);
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete AreaLoc failed");
  }
};

exports.getAreaLoc = async (req, res) => {
  try {
    const state = await AreaLoc.findOne({ _id: req.params._id }).exec();
    console.log("get AreaLoc", state);
    res.json(state);
  } catch (error) {
    console.log(error);
    res.status(400).send("get AreaLoc failed");
  }
};

exports.createAreaLoc = async (req, res) => {
  try {
    console.log(req.body);
    // const code = await AreaLoc.findOne({ AreaLocCode: req.body.AreaLocCode });
    const AreaLocName = await AreaLoc.findOne({ AreaLocName: req.body.AreaLocName });
   
    // else if (code) {
    //   return res
    //     .status(200)
    //     .json({
    //       isOk: false,
    //       field: 2,
    //       message: "AreaLoc with this code already exists!",
    //     });
    // }
    
      const addAreaLoc = await new AreaLoc(req.body).save();
      console.log("create AreaLoc", addAreaLoc);
      res.status(200).json({ isOk: true, data: addAreaLoc });
    
  } catch (err) {
    console.log("log error from create AreaLoc", err);
    return res.status(400).send("create dynamic content failed");
  }
};

exports.updateAreaLoc = async (req, res) => {
  try {
    const update = await AreaLoc.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    console.log("edit AreaLoc", update);
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update AreaLoc failed");
  }
};

exports.removeAndUpdateAreaLoc = async (req, res) => {
  try {
    const update = await AreaLoc.findOneAndUpdate(
      { _id: req.params._id },
      { isActive: false },
      { new: true }
    );
    console.log(update);
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("remove AreaLoc failed");
  }
};
