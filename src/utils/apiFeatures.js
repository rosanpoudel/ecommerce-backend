class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const search = this.queryString.search
      ? {
          name: new RegExp(this.queryString.search, "i"),
        }
      : {};

    this.query = this.query.find({ ...search });
    return this;
  }

  filter() {
    const tempQuery = { ...this.queryString };

    // category filter
    const fieldsToBeRemoved = ["search", "page", "limit"];
    fieldsToBeRemoved.forEach((key) => delete tempQuery[key]);

    // price filter
    let queryStr = JSON.stringify(tempQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`); //mongo db searches for key with $ sign in front so adding $ infront of key

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

export default ApiFeatures;
