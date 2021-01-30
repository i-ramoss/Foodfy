-- Create Database
-- CREATE DATABASE foodfy;

-- Delete Database
-- DROP DATABASE IF EXISTS foodfy;

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" BOOLEAN DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT(now()),
  "updated_at" timestamp DEFAULT(now())
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "file_id" int NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "title" text NOT NULL,
  "chef_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "ingredients" text[] NOT NULL,
  "preparation" text[] NOT NULL,
  "information" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" int NOT NULL,
  "file_id" int NOT NULL
);

-- Foreign keys:
ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");
ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

-- Create procedure
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers:
-- auto updated_at users
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- auto updated_at recipes
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Create session table
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- to run seeds
DELETE FROM recipe_files;
DELETE FROM chefs;
DELETE FROM files;
DELETE FROM recipes;
DELETE FROM users;

-- restart sequence auto_increment from tables ids
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;