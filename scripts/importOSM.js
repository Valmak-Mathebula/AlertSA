import axios from "axios";
import db from "../config/db.js";

const provinces = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
];

for (const province of provinces) {
  console.log("Importing", province);

  let page = 0;

  while (true) {
    const url =
      "https://nominatim.openstreetmap.org/search?" +
      new URLSearchParams({
        country: "South Africa",
        state: province,
        q: "",
        format: "jsonv2",
        addressdetails: "1",
        limit: "50",
        offset: page * 50,
      });

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "AlertSA/1.0",
      },
    });

    if (data.length === 0) break;

    for (const p of data) {
      const a = p.address || {};

      const suburb = a.suburb || a.neighbourhood || a.quarter || a.hamlet || "";

      const town = a.city || a.town || a.village || "";

      if (!suburb || !town) continue;

      await db.query(
        `
        INSERT IGNORE INTO locations
        (
          province,
          town,
          suburb,
          latitude,
          longitude
        )
        VALUES
        (?,?,?,?,?)
        `,
        [province, town, suburb, p.lat, p.lon],
      );
    }

    console.log(`${province} page ${page + 1}`);

    page++;

    await new Promise((r) => setTimeout(r, 1200));
  }
}

console.log("DONE");
process.exit();
