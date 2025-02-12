const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/masala-imageboard"
);

///////////// images /////////////

module.exports.getImage = () => {
    const q = `SELECT * FROM images 
    ORDER BY id DESC
    LIMIT 3`;
    return db.query(q);
};

module.exports.getMoreImages = (highest_id) => {
    const q = ` SELECT *, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 6`;
    const params = [highest_id];
    return db.query(q, params);
};

module.exports.addImage = (title, username, description, file) => {
    const q = `INSERT INTO images (title, username, description, url) VALUES ($1, $2, $3, $4)
    RETURNING *`;
    const params = [title, username, description, file];
    return db.query(q, params);
};

module.exports.getImageById = (id) => {
    const q = `SELECT * FROM images WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};

///////////// comments /////////////

module.exports.addComment = (comment, username, id) => {
    const q = `INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3) RETURNING *;`;
    const params = [comment, username, id];
    return db.query(q, params);
};

module.exports.getCommentById = (id) => {
    const q = `SELECT * FROM comments WHERE image_id=$1`;
    const params = [id];
    return db.query(q, params);
};

///////////// delete image /////////////

module.exports.deleteImageId = (id) => {
    const q = `DELETE FROM images WHERE id = $1 RETURNING id`;
    const params = [id];
    return db.query(q, params);
};

module.exports.deleteAllComments = (id) => {
    const q = `DELETE FROM comments WHERE image_id = $1`;
    const params = [id];
    return db.query(q, params);
};
