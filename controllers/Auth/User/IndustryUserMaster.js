const jwt = require("jsonwebtoken");
const User = require("../../../models/IndustryUserMaster/IndustryUserMaster");

exports.userLoginExamUser = async (req, res) => {
  const { UserName, Password } = req.body;
  try {
    const usermp = await User.findOne({ UserName: UserName }).exec();
    if (usermp) {
      if (usermp.Password !== Password) {
        return res.status(200).json({
          isOk: false,
          filed: 1,
          message: "Authentication Failed",
        });
      } else {
        // Generate JWT
        const token = jwt.sign(
          { _id: usermp._id, UserName: usermp.UserName },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          isOk: true,
          message: "Authentication Successful",
          token: token,
          data: usermp,
        });
      }
    } else {
      res.status(200).json({
        isOk: false,
        message: "ExamUser User not Found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(200).json({
      isOk: false,
      message: "An error occurred while logging in ExamUserpanel",
    });
  }
};

exports.getExamUser = async (req, res) => {
  try {
    const find = await User.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listExamUser = async (req, res) => {
  try {
    const list = await User.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};
