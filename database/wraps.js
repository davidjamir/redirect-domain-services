const { getDb } = require("./mongodb"); // MongoDB client

// Tạo một kết nối tới MongoDB và lấy collection "blogs"
async function getCollection() {
  const db = await getDb();
  return db.collection("wraps");
}

// Lấy tất cả tài liệu trong collection
async function getAllWraps() {
  try {
    const col = await getCollection();
    const blogs = await col.find().sort({ createdAt: 1 }).toArray();
    return blogs;
  } catch (error) {
    console.error("Error fetching all documents:", error);
    throw error;
  }
}

// Lấy một tài liệu theo điều kiện
async function getOneWrapDomain(filter) {
  try {
    const col = await getCollection();
    const blog = await col.findOne(filter);
    return blog;
  } catch (error) {
    console.error("Error fetching one document:", error);
    throw error;
  }
}

module.exports = {
  getAllWraps,
  getOneWrapDomain,
};
