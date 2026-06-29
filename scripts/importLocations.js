import mysql from "mysql2/promise";
import fs from "fs";
import readline from "readline";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "appsmat1_alertssa",
});

const rl = readline.createInterface({
  input: fs.createReadStream("./ZA.txt"),
  crlfDelay: Infinity,
});

for await (const line of rl) {
  const c = line.split("\t");

  await db.query(
    `
        INSERT INTO locations
        (
            suburb,
            town,
            province,
            latitude,
            longitude
        )
        VALUES
        (
            ?,
            '',
            '',
            ?,
            ?
        )
        `,

    [c[2], c[9], c[10]],
  );
}

console.log("DONE");

process.exit();
