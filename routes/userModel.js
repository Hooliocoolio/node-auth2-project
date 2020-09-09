const db = require('../data/dbconfig')

module.exports = {
    register,
    findBy,
    findById,
    find,
    findByDept
}
//-----------------------------------------------------------------------------
async function register(user) {
    const[id] = await db('users').insert(user)
    return findById(id)
}

//-----------------------------------------------------------------------------
function findBy(filter) {
    return db('users')
        .select('id', 'username', 'password')
        .where(filter)
}

//-----------------------------------------------------------------------------
function findById(id) {
	return db("users")
		.select("id", "username")
		.where({ id })
		.first()
}

//-----------------------------------------------------------------------------
function find() {
	return db("users").select("id", "username")
}


function findByDept(department) {
    return db("users")
    .select("id", "username", "department")
    .where("department", '=', "managers")
    .orWhere("department", '=', "security")

}