  const ExcelJS = require('exceljs');
const ResultData = require("../../models/ResultData/ResultData");
const ResultAns = require("../../models/ResultAns/ResultAns");

const getResultAnsData = async (userID, testID) => {
  try {
    const find = await ResultAns.find({
      userId: userID,
      id: testID,
    }).populate("pointMasterId").exec();

    return (find);
  } catch (error) {
    console.log("error in finding result ans", error);
  }
};

const getResultDataByIndustry = async (industry) => {
  try {
    const find = await ResultData.find({}) // Find all records in `ResultData`
      .populate({
        path: "userId",
        match: { IndustryCategory: industry }, 
      })
      // Populate the `id` field with data from TestCatMaster if needed
      .exec();

    // Filter out records where `userId` didn't match the query
    const filteredResults = find.filter((result) => result.userId !== null);

    return filteredResults;
  } catch (error) {
    console.error("Error fetching result data:", error);
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





exports.excelResultData = async (req, res) => {
  try {
    const { industry, testCategory, startDate, endDate } = req.body;

    // Parse startDate and endDate to JavaScript Date objects
    const parsedStartDate = new Date(`${startDate}T00:00:00Z`);
    const parsedEndDate = new Date(`${endDate}T23:59:59Z`); // End of the day

    // Fetch TestData from your database based on industry
    const TestData = await getResultDataByIndustry(industry);

    // Filter TestData based on the ExamDate being between startDate and endDate
    const filteredTestData = TestData.filter((item) => {
      const examDate = new Date(item.ExamDate);
      return examDate >= parsedStartDate && examDate <= parsedEndDate;
    });

    // Assuming testCategory is a single object with an _id field

    // Assuming testCategory has a field 'industry' and filteredTestData has 'IndustryCategory' inside 'userId'
    const matchedData = filteredTestData.filter(
      (testData) =>
        testData.id.toString() ===
        req.body.testCategory.toString()
    );
    // Now, matchedData will contain entries from filteredTestData where the userId.IndustryCategory matches testCategory.industry

    // Now, matchedData will contain entries from filteredTestData where the id matches testCategory._id

    // Create a new workbook and a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Results");

    // Create a Map to store unique PointID and the first corresponding title
    const pointIdToTitleMap = new Map();

    // First pass: collect all unique PointIDs and their corresponding title from the first occurrence
    for (const item of matchedData) {
      const resultanswer = await getResultAnsData(item.userId._id, item.id);
      resultanswer.forEach((answer) => {
        // Check if PointID is defined before proceeding
        if (answer.pointMasterId && answer.pointMasterId.PointID) {
          const pointId = answer.pointMasterId.PointID.toString();
          if (!pointIdToTitleMap.has(pointId)) {
            pointIdToTitleMap.set(
              pointId,
              answer.pointMasterId.PointMasterTitle
            );
          }
        }
      });
    }

    // Convert the Map keys (PointIDs) into an array for easier processing
    const pointIdsArray = Array.from(pointIdToTitleMap.keys());

    // Define base columns
    const baseColumns = [
      { header: "Name", key: "name", width: 30 },
      { header: "Username", key: "username", width: 20 },
      { header: "Email", key: "email", width: 20 },
      { header: "Exam Date(Seconds)", key: "examDate", width: 20 },
      { header: "Time Taken", key: "timeTaken", width: 20 },
    ];

    // Dynamically create columns for each PointID, using the title from the first matching data as the header
    const pointIdColumns = pointIdsArray.map((pointId) => ({
      header: pointIdToTitleMap.get(pointId), // Use the title as the column header
      key: pointId, // Use the PointID as the key for identifying columns
      width: 20,
    }));

    // Add a Total column at the end
    const totalColumn = { header: "Total", key: "total", width: 10 };

    // Set columns for the worksheet
    worksheet.columns = [...baseColumns, ...pointIdColumns, totalColumn];

    // Second pass: process each user's data and populate the rows
    for (const item of matchedData) {

      const resultanswer = await getResultAnsData(item.userId._id, item.id);

      // Create an object to store totals for each PointID
      const pointIdTotals = {};

      // Initialize totals for each PointID with 0
      pointIdsArray.forEach((pointId) => {
        pointIdTotals[pointId] = 0;
      });

      // Accumulate points in the appropriate category based on PointID
      resultanswer.forEach((answer) => {
        // Only process answers where PointID is defined
        if (answer.pointMasterId && answer.pointMasterId.PointID) {
          const pointId = answer.pointMasterId.PointID.toString();
          if (pointIdTotals[pointId] !== undefined) {
            pointIdTotals[pointId] +=
              parseFloat(answer.pointMasterId.PointMasterPoints) || 0;
          }
        }
      });

      // Calculate total points for the user
      const totalPoints = Object.values(pointIdTotals).reduce(
        (acc, val) => acc + val,
        0
      );

      // Add a row with the aggregated results
      worksheet.addRow({
        name: item.userId.Name,
        username: item.userId.UserName,
        email: item.userId.Email,
        examDate: item.ExamDate,
        timeTaken: item.TotalTime,
        ...pointIdTotals, // Spread point totals into the row
        total: totalPoints, // Add the total points
      });
    }

    console.log("User data rows added");

    // Write the workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();
    console.log("Excel file created and buffer obtained");

    // Set headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", 'attachment; filename="result.xlsx"');
    res.setHeader("Content-Length", buffer.length);

    console.log("Response headers set");
    res.setHeader("Processing-Status", "Completed");

    // Send the buffer as the response
    res.end(buffer);
  } catch (err) {
    console.error("Error generating Excel:", err);
    return res.status(500).send("Internal Server Error");
  }
};

