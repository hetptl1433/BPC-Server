// models/ResultSearchModel.js
class ResultSearchModel {
  constructor(
    testCategoryId,
    industryId,
    testCategoryMasterList = [],
    industryList = []
  ) {
    this.testCategoryId = testCategoryId;
    this.industryId = industryId;
    this.testCategoryMasterList = testCategoryMasterList;
    this.industryList = industryList;
  }
}

module.exports = ResultSearchModel;
