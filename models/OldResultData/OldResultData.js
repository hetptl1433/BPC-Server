class ExamDetail {
  constructor(
    examDetailId,
    examId,
    userId,
    testGroupId,
    testCategoryId,
    testQuestionId,
    answer,
    pointGain,
    aTime,
    aTimeInt,
    aBy,
    mTime,
    mTimeInt,
    mBy,
    dTime,
    dTimeInt,
    dBy,
    activeFlag,
    isActive
  ) {
    this.examDetailId = examDetailId;
    this.examId = examId;
    this.userId = userId;
    this.testGroupId = testGroupId;
    this.testCategoryId = testCategoryId;
    this.testQuestionId = testQuestionId;
    this.answer = answer;
    this.pointGain = pointGain;
    this.aTime = aTime;
    this.aTimeInt = aTimeInt;
    this.aBy = aBy;
    this.mTime = mTime;
    this.mTimeInt = mTimeInt;
    this.mBy = mBy;
    this.dTime = dTime;
    this.dTimeInt = dTimeInt;
    this.dBy = dBy;
    this.activeFlag = activeFlag;
    this.isActive = isActive;
  }
}

module.exports = ExamDetail;
