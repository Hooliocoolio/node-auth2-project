
exports.up = function (knex) {
    return knex.schema
      .createTable("roles", tbl => {
        tbl.increments("id");
  
        tbl.string("name", 128).notNullable().unique();
      })
      .createTable("users", tbl => {
        tbl.increments("id");
  
        tbl.string("username", 128).notNullable().unique().index();
        tbl.string("password", 256).notNullable();
        tbl.string("department", 128)
  
        tbl
          .integer("role")
          .unsigned()
          .references("roles.id")
          .onDelete("RESTRICT")
          .onUpdate("CASCADE");
      });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("roles").dropTableIfExists("users");
  };