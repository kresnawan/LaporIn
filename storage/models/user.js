import query from "../../db/query"

const user = {
    getAll() {
        query(`
            SELECT
                *
            FROM
                user
            `).then(result => {
            const results = result.results;
            if (!results[0]) throw new Error(0);

            return results;
        }).catch(err => {
            throw new Error(err);
        });
    }
}