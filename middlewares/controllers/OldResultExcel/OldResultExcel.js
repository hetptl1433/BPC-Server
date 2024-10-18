const sql = require("mssql");
const ExamMasterModel = require("../../models/OldResultData/OldResultData");
const { use } = require("../../routes/OldResult");
const ExcelJS = require("exceljs");

const sqlConfig = {
  user: "bpcindia_unn",
  password: "d^Je22s1^%$",
  database: "bpcindia_db",
  server: "173.212.206.37",
  port: 1533,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};



const excelLegacyResultData = async (req, res) => {
  try {
    console.log("API request received");

    const { industry, testCategory, startDate, endDate } = req.body;
    console.log("Start Date:", startDate, "End Date:", endDate);

    // Adjust the start and end dates to include time for the full day range
    const adjustedStartDate = `${startDate} 00:00:00.000`; // Start of the day
    const adjustedEndDate = `${endDate} 23:59:59.999`; // End of the day

    console.log(
      "Adjusted Start Date:",
      adjustedStartDate,
      "Adjusted End Date:",
      adjustedEndDate
    );

    // Fetch ExamMaster data based on the testCategory, date range, and industry
    // Fetch ExamMaster data based on the testCategory, date range, and industry
    const queryExamMaster = `
  SELECT 
    EM.[ExamId], 
    EM.[ExamUniqueCode], 
    EM.[ExamDateTime], 
    EM.[UserId], 
    EM.[TestGroupId], 
    EM.[TestCategoryId], 
    UM.[Name] AS UserName, 
    UM.[Username], 
    UM.[Email]
  FROM 
    [bpcindia_db].[dbo].[ExamMaster] EM
  JOIN 
    [bpcindia_db].[dbo].[UserMaster] UM 
  ON 
    EM.[UserId] = UM.[UserId]
  WHERE 
    (EM.[TestCategoryId] = '${testCategory}' OR EM.[TestCategoryId] = 0)  -- Include records with TestCategoryId = 0
    AND UM.[IndustryId] = '${industry}'  -- Industry filter
    AND EM.[ExamDateTime] BETWEEN '${adjustedStartDate}' AND '${adjustedEndDate}';
`;

    const examData = await sql.query(queryExamMaster);
    console.log("Exam Data:", examData);

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Results");

    // Create a Set to collect unique PointCategoryNames
    const pointCategorySet = new Set();

    // For each exam, fetch the associated details and collect PointCategoryNames
    for (const exam of examData.recordset) {
      const queryExamDetails = `
        SELECT 
          PCM.[PointCategoryName],
          SUM(COALESCE(EDM.[PointGain], 0)) AS TotalPointsForCategory
        FROM 
          [bpcindia_db].[dbo].[ExamDetailMaster] EDM
        LEFT JOIN 
          [bpcindia_db].[dbo].[PointsMaster] PM ON EDM.[PointGain] = PM.[PointId]
        LEFT JOIN 
          [bpcindia_db].[dbo].[PointCategoryMaster] PCM ON PM.[PointCategoryId] = PCM.[PointCategoryId]
        WHERE 
          EDM.[ExamId] = ${exam.ExamId}
        GROUP BY 
          PCM.[PointCategoryName]
      `;

      const examDetails = await sql.query(queryExamDetails);

      console.log("Exam Details:", examDetails);
      examDetails.recordset.forEach((detail) => {
        if (detail.PointCategoryName) {
          pointCategorySet.add(detail.PointCategoryName); // Collect unique PointCategoryNames
        }
      });
    }

    // Convert the Set to an array for easier processing
    const pointCategoryArray = Array.from(pointCategorySet);

    // Define base columns (User details)
    const baseColumns = [
      { header: "Name", key: "UserName", width: 30 },
      { header: "Username", key: "Username", width: 20 },
      { header: "Email", key: "Email", width: 30 },
    ];

    // Define dynamic columns based on the unique PointCategoryNames
    const dynamicColumns = pointCategoryArray.map((category) => ({
      header: category, // Use PointCategoryName as the column header
      key: category, // Use PointCategoryName as the key for data insertion
      width: 20,
    }));

    // Add a Total Points column at the end
    const totalPointsColumn = {
      header: "Total Points",
      key: "TotalPoints",
      width: 15,
    };

    // Set the columns for the worksheet
    worksheet.columns = [...baseColumns, ...dynamicColumns, totalPointsColumn];

    console.log("Header row added with dynamic PointCategory columns");

    // Process each exam and populate the rows
    for (const exam of examData.recordset) {
      console.log(`Processing Exam ID: ${exam.ExamId}`);

      // Fetch the ExamDetails for this specific exam
      const queryExamDetails = `
        SELECT 
          PCM.[PointCategoryName],
          SUM(COALESCE(PM.[Points], 0)) AS TotalPointsForCategory
        FROM 
          [bpcindia_db].[dbo].[ExamDetailMaster] EDM
        LEFT JOIN 
          [bpcindia_db].[dbo].[PointsMaster] PM ON EDM.[PointGain] = PM.[PointId]
        LEFT JOIN 
          [bpcindia_db].[dbo].[PointCategoryMaster] PCM ON PM.[PointCategoryId] = PCM.[PointCategoryId]
        WHERE 
          EDM.[ExamId] = ${exam.ExamId}
        GROUP BY 
          PCM.[PointCategoryName]
      `;

      const examDetails = await sql.query(queryExamDetails);

      // Create an object to store total points for each PointCategory
      const pointsByCategory = {};

      // Initialize each PointCategory's total points as 0
      pointCategoryArray.forEach((category) => {
        pointsByCategory[category] = 0;
      });

      // Fill in the total points for each category
      examDetails.recordset.forEach((detail) => {
        if (detail.PointCategoryName) {
          pointsByCategory[detail.PointCategoryName] =
            detail.TotalPointsForCategory || 0;
        }
      });

      // Calculate the overall total points for the exam
      const totalPoints = Object.values(pointsByCategory).reduce(
        (sum, points) => sum + parseFloat(points || 0),
        0
      );

      // Add the row with user details and points by category
      worksheet.addRow({
        UserName: exam.UserName,
        Username: exam.Username,
        Email: exam.Email,
        ...pointsByCategory, // Spread the points by category into the row
        TotalPoints: totalPoints, // Add the overall total points
      });
    }

    console.log("User data rows added with points by category");

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

    // Send the buffer as the response
    res.end(buffer);
    console.log("Response sent");
  } catch (err) {
    console.error("Error generating Excel:", err);
    return res.status(500).send("Internal Server Error");
  }
};









module.exports = {
excelLegacyResultData
};