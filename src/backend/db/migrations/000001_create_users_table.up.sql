CREATE TABLE IF NOT EXISTS users(
   user_id serial PRIMARY KEY,
   username VARCHAR (100) UNIQUE NOT NULL,
  -- TODO Salt
   password VARCHAR (100) NOT NULL,
   email VARCHAR (300) UNIQUE NOT NULL
);
