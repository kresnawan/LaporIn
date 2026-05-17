import "dotenv/config";
import query from "../db/query.js";
import path from "path";
import knex from "knex";

const knexInstance = knex({ client: 'mysql' });

import fs from 'fs/promises';
import { pool } from "../db/connection-pool.js";

export const handleGetReport = async (req, res) => {
	const {
		k = "",
		p = "1",
		category = "",
		sort_by = "newest",
		status_id = "",
		report_id
	} = req.query;

	if (status_id === "all" && req.userRole !== 2) {
		return res.status(403).send();
	}

	try {
		if (report_id) {
			const reportRows = await query(`
                SELECT 
					r.*,
					CONCAT(uu.first_name, ' ', uu.last_name) as author_name,
					CONCAT(u.first_name, ' ', u.last_name) as acceptor 
                FROM 
					report r 
                LEFT JOIN 
					report_acceptance ra ON r.report_id = ra.report_id
                LEFT JOIN 
					user u ON u.user_id = ra.acceptor_id
				LEFT JOIN
					user uu ON uu.user_id = r.author_id
                WHERE r.report_id = ?
            `, [report_id]);

			if (reportRows.results.length === 0) return res.status(404).json({ message: "Not Found" });

			const imageRows = await query(`SELECT image_url FROM report_image WHERE report_id = ?`, [report_id]);

			return res.send({
				...reportRows.results[0],
				images: imageRows.results
			});
		}

		let sql = `
            SELECT 
				r.report_id, 
				r.author_id, 
				CONCAT(u.first_name, ' ', u.last_name) AS author_name,
            	r.report_title, 
				r.report_body, 
				r.latitude, 
				r.longitude, 
				r.upvote, 
				r.downvote,
				${req.userId ? ` rv.vote_type AS user_vote,` : ``}
            	img.image_url, 
				r.status_id, 
				r.created_at
            FROM report r
            INNER JOIN user u ON u.user_id = r.author_id
            INNER JOIN (
                SELECT report_id, image_url, ROW_NUMBER() OVER (PARTITION BY report_id) as rn
                FROM report_image
            ) img ON r.report_id = img.report_id`;

		let queryArgs = [];

		if (req.userId) {
			sql += ` LEFT JOIN report_vote rv ON r.report_id = rv.report_id AND rv.user_id = ?`
			queryArgs.push(req.userId);
		}

		sql += ` WHERE img.rn = 1 AND LOWER(r.report_title) LIKE ?`;
		queryArgs.push(`%${k.toLowerCase()}%`);

		if (category !== "all") {
			sql += ` AND r.category_id = ?`;
			queryArgs.push(category);
		}
		if (status_id !== "all") {
			sql += ` AND r.status_id = ?`;
			queryArgs.push(status_id);
		}

		const orderBy = () => {
			if (sort_by === "newest") {
				return "r.created_at DESC"
			} else if (sort_by === "oldest") {
				return "r.created_at ASC"
			} else if (sort_by === "upvote") {
				return "r.upvote DESC, r.created_at DESC";
			} else if (sort_by === "downvote") {
				return "r.downvote DESC, r.created_at DESC";
			}
		}

		sql += ` ORDER BY ${orderBy()} LIMIT 8 OFFSET ?`;

		const offset = (Math.max(1, parseInt(p)) - 1) * 8;
		queryArgs.push(offset);

		const results = await query(sql, queryArgs);
		return res.send(results.results);

	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
}

export const handleGetReportSelf = async (req, res) => {
	const {
		k = "",
		p = "1",
		category = "all",
		sort_by = "newest",
		status_id = "all"
	} = req.query;

	try {
		let sql = `
            SELECT 
				r.report_id, 
				r.author_id, 
				CONCAT(u.first_name, ' ', u.last_name) AS author_name,
            	r.report_title, 
				r.report_body, 
				r.latitude, 
				r.longitude, 
				r.upvote, 
				r.downvote,
            	img.image_url, r.status_id, r.created_at
            FROM report r
            INNER JOIN user u ON u.user_id = r.author_id
            INNER JOIN (
                SELECT report_id, image_url, ROW_NUMBER() OVER (PARTITION BY report_id) as rn
                FROM report_image
            ) img ON r.report_id = img.report_id
            WHERE img.rn = 1 AND LOWER(r.report_title) LIKE ?
        `;

		let queryArgs = [`%${k.toLowerCase()}%`];

		if (category !== "all") {
			sql += ` AND r.category_id = ?`;
			queryArgs.push(category);
		}
		if (status_id !== "all") {
			sql += ` AND r.status_id = ?`;
			queryArgs.push(status_id);
		}

		sql += ` AND r.author_id = ?`;
		queryArgs.push(req.userId);

		const orderBy = () => {
			if (sort_by === "newest") {
				return "r.created_at DESC"
			} else if (sort_by === "oldest") {
				return "r.created_at ASC"
			} else if (sort_by === "upvote") {
				return "r.upvote DESC, r.created_at DESC";
			} else if (sort_by === "downvote") {
				return "r.downvote DESC, r.created_at DESC";
			}
		}

		sql += ` ORDER BY ${orderBy()} LIMIT 8 OFFSET ?`;

		const offset = (Math.max(1, parseInt(p)) - 1) * 8;
		queryArgs.push(offset);

		const results = await query(sql, queryArgs);
		return res.send(results.results);

	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
}

export const handleGetReportLength = async (req, res) => {
    const { k = "", category = "", status_id = "" } = req.query;

    try {
        let sql = `
            SELECT 
                COUNT(r.report_id) AS count
            FROM report r
            WHERE LOWER(r.report_title) LIKE ?
        `;

        let queryArgs = [`%${k.toLowerCase()}%`];

        if (category !== "all") {
            sql += ` AND r.category_id = ?`;
            queryArgs.push(category);
        }
        if (status_id !== "all") {
            sql += ` AND r.status_id = ?`;
            queryArgs.push(status_id);
        }

        const results = await query(sql, queryArgs);
        return res.send(results.results);

    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export const handlePostReport = async (req, res) => {
    if (!req.userRole) {
        return res.status(403).send("Anda tidak memiliki akses");
    }

    const files = req.files;
    const { report_title, report_body, lat, long, category } = req.body;

    if (!files || files.length === 0 || !report_title || !report_body || !lat || !long || !category) {
        return res.status(400).send('Body tidak lengkap');
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const [result] = await connection.execute(`
            INSERT INTO
                report (
                    author_id, 
                    report_title, 
                    report_body, 
                    latitude, 
                    longitude,
                    category_id,
                    status_id
                )
            VALUES
                (?, ?, ?, ?, ?, ?, ?)`,
            [req.userId, report_title, report_body, lat, long, category, 1]);

        const { sql, bindings } = knexInstance('report_image')
            .insert(files.map(file => ({ report_id: result.insertId, image_url: file.filename })))
            .toSQL().toNative();

        await connection.execute(sql, bindings);

        await connection.commit();

        return res.send("Report berhasil diajukan")
    } catch (error) {
        await connection.rollback();
        files.forEach(file => {
            fs.unlink(file.path, (err) => {
                if (err) console.error("Gagal hapus:", file.path);
            });
        });

        return res.status(500).send(error);
    } finally {
        connection.release();
    }
}

export const handlePatchReport = async (req, res) => {
	const { id } = req.query;
	const { accept, reject, done, upvote, downvote } = req.body;

	if (upvote && downvote) return res.status(400).send();

	if (upvote || downvote) {
		const abc = () => {
			const obj = {
				vote_type: "",
				set_syntax: ""
			}

			if (upvote) {
				obj.vote_type = "1"
				obj.set_syntax = "upvote = upvote + 1"
			} else if (downvote) {
				obj.vote_type = "-1"
				obj.set_syntax = "downvote = downvote + 1"
			}

			return obj
		}
		const conn = await pool.getConnection();
		try {
			await conn.beginTransaction();

			let updateSet = abc();

			async function deleteVote(conn, report_id, user_id, update_set) {
				await conn.execute(`
				DELETE FROM 
					report_vote
				WHERE
					report_id = ? AND user_id = ?
			`, [report_id, user_id]);

				await conn.execute(`
				UPDATE 
					report 
				SET 
					${update_set} 
				WHERE 
					report_id = ?
			`, [report_id]);
			}

			const [rows, fields] = await conn.execute(`SELECT vote_type FROM report_vote WHERE report_id = ? AND user_id = ?`, [id, req.userId]);
			if (rows.length > 0) {
				if (rows[0].vote_type === -1) {
					if (upvote) {
						updateSet.set_syntax = "upvote = upvote + 1, downvote = downvote - 1";
					} else if (downvote) {
						deleteVote(conn, id, req.userId, "downvote = downvote - 1")
						conn.commit();
						return res.send();
					}
				} else if (rows[0].vote_type === 1) {
					if (downvote) {
						updateSet.set_syntax = "downvote = downvote + 1, upvote = upvote - 1";
					} else if (upvote) {
						deleteVote(conn, id, req.userId, "upvote = upvote - 1")
						conn.commit();
						return res.send();
					}
				}
			}

			await conn.execute(`
				INSERT INTO 
					report_vote 
					(report_id, user_id, vote_type) 
				VALUES 
					(?, ?, ?)
				ON DUPLICATE KEY UPDATE
					vote_type = ?
			`, [id, req.userId, abc().vote_type, abc().vote_type]);

			await conn.execute(`
				UPDATE 
					report 
				SET 
					${updateSet.set_syntax} 
				WHERE 
					report_id = ?
			`, [id]);

			await conn.commit();

			return res.send();
		} catch (error) {
			await conn.rollback();
			return res.status(500).send(error);
		} finally {
			conn.release();
		}
	}

	if ((accept || reject) && req.userRole !== 2) {
		return res.status(403).send("Anda tidak memiliki akses");
	}

	if (accept) {
		const conn = await pool.getConnection();
		try {
			await conn.beginTransaction();
			const updateResult = await conn.execute(`
                UPDATE
                    report
                SET
                    status_id = 2
                WHERE
                    report_id = ? AND status_id = 1
            `, [id]);

			if (updateResult[0].affectedRows < 1) {
				await conn.rollback();
				return res.status(400).send("Aduan tidak ditemukan atau status bukan 1")
			}

			await conn.execute(`
				INSERT INTO
					report_acceptance (report_id, acceptor_id)
				VALUES
					(? , ?)	
			`, [id, req.userId])

			await conn.commit();
			return res.send("Aduan berhasil disetujui");
		} catch (error) {
			conn.rollback();
			return res.status(500).send(error);
		}
	} else if (reject) {
		try {
			const result = await query(`
                UPDATE
                    report
                SET
                    status_id = 3
                WHERE
                    report_id = ? AND status_id = 1
            `, [id]);

			if (result.results.affectedRows < 1) {
				return res.status(400).send("Aduan tidak ditemukan atau status bukan 1")
			}

			return res.send("Aduan berhasil ditolak");
		} catch (error) {
			return res.status(500).send(error);
		}
	} else if (done) {
		try {
			const result = await query(`
                UPDATE
                    report
                SET
                    status_id = 4
                WHERE
                    report_id = ? AND (status_id = 2 OR status_id = 3) AND author_id = ?
            `, [id, req.userId]);

			if (result.results.affectedRows < 1) {
				return res.status(400).send("Aduan gagal dinyatakan selesai atau anda tidak memiliki akses atau aduan tidak ditemukan");
			}

			return res.send("Aduan berhasil dinyatakan selesai");
		} catch (error) {
			return res.status(500).send(error);
		}
	} else {
		return res.status(400).send("Body kosong");
	}
}

export const handleDeleteReport = async (req, res) => {
	const { id } = req.query;

	try {
		const checkResult = await query(`
            SELECT report_id FROM report 
            WHERE report_id = ? AND author_id = ?
        `, [id, req.userId]);

		if (checkResult.results.length < 1) {
			return res.status(403).send("Anda tidak memiliki akses atau data tidak ditemukan");
		}

		const imageResult = await query(`
            SELECT image_url FROM report_image WHERE report_id = ?   
        `, [id]);
		const imageData = imageResult.results;

		await query(`DELETE FROM report WHERE report_id = ?`, [id]);

		await Promise.all(imageData.map(async (img) => {
			try {
				const filePath = path.join('report_images', img.image_url);
				await fs.unlink(filePath);
			} catch (err) {
				console.error(`Gagal hapus file fisik: ${img.image_url}`, err);
			}
		}));

		return res.send("Aduan dan gambar terkait berhasil dihapus permanen");

	} catch (error) {
		console.error(error);
		return res.status(500).send("Terjadi kesalahan pada server");
	}
}