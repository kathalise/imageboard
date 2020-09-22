const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/masala-imageboard"
);

module.exports.getImage = () => {
    const q = `SELECT * FROM images ORDER BY id DESC`;

    return db.query(q);
};

module.exports.addImage = (title, username, description, file) => {
    const q = `INSERT INTO images (title, username, description, url) VALUES ($1, $2, $3, $4)
    RETURNING *`;
    const params = [title, username, description, file];
    return db.query(q, params);
};
