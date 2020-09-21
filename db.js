const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/masala-imageboard"
);

module.exports.getImageAndTitle = () => {
    const q = `SELECT url, title FROM images`;

    return db.query(q);
};
