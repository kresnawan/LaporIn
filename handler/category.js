import "dotenv/config";
import query from "../db/query.js";

export const handleGetCategories = (req, res) => {
    const { name = "", id = "" } = req.query;

    query(`
        SELECT
            category_id,
            category_name
        FROM
            category
        WHERE 
            LOWER(category_name) LIKE ? AND category_id LIKE ?
    `, [`%${name.toLowerCase()}%`, `%${id}%`]).then(results => {
        return res.send(results.results);
    }).catch(err => {
        return res.status(500).send(err)
    })
}

export const handlePostCategories = async (req, res) => {
    if (req.userRole !== 2) {
        return res.status(403).send();
    }
    const { category_name } = req.body;

    try {
        await query(`
            INSERT INTO
                category (category_name)
            VALUES (?)    
        `, [category_name])
    } catch (error) {
        return res.status(500).send();
    }
}

export const handlePatchCategories = async (req, res) => {
    if (req.userRole !== 2) {
        return res.status(403).send("Anda tidak memiliki akses");
    }

    const { id } = req.query;
    const { category_name } = req.body;

    try {
        await query(`
            UPDATE 
                category
            SET 
                category_name = ?
            WHERE 
                category_id = ?    
        `, [category_name, id]);

        return res.send("Kategori berhasil diubah");
    } catch (error) {
        return res.status(500).send();
    }
}

export const handleDeleteCategories = async (req, res) => {
    if (req.userRole !== 2) {
        return res.status(403).send("Anda tidak memiliki akses");
    }

    const { id } = req.query;

    try {
        await query(`
            DELETE FROM
                category
            WHERE
                category_id = ?
        `, [id]);

        return res.send("Kategori berhasil diubah");
    } catch (error) {
        return res.status(500).send(error);
    }
}