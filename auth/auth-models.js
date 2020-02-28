const db = require("../database/dbConfig.js");

function add(user) {
  return db("users")
    .insert(user, "id")
    .then(ids => {
      const [id] = ids;
      return db("users")
        .where({ id })
        .first();
    });
}

function getBy(filter) {
  return db("users")
    .where(filter)
    .first();
}

module.exports = {
  add,
  getBy
};
