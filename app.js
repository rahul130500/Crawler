const request = require("request");
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
axios
  .get("https://www.iitg.ac.in/acad/CourseStructure/Btech2018/btech.php")
  .then((res) => {
    const $ = cheerio.load(res.data);
    const address = [];
    var i = 0;
    $("tbody>tr>td").each((index, element) => {
      const title = $(element).children().first().text();
      const link = $(element).children("a").last().attr("href");
      if (link != undefined && link.startsWith("https://www.iitg.ac.in/acad")) {
        address[i] = { title, link };
        i = i + 1;
      }
    });
    // console.log(address);
    for (var j = 0; j < address.length; j++) {
      var data1 = {};
      data1.table = [];
      var k = 0;
      axios
        .get(address[j].link)
        .then((res) => {
          const $ = cheerio.load(res.data);

          $("tbody>tr>td>p>span").each((index, element) => {
            const coursename = $(element).children().first().text();
            var link = $(element).children("a").last().attr("href");
            if (link != undefined) {
              if (!link.startsWith("https:")) {
                var string =
                  "https://www.iitg.ac.in/acad/CourseStructure/Btech2018/";
                link = string + link;
              }
              data1.table[k] = { coursename, link };
              k = k + 1;
            }
          });
          fs.writeFileSync("Links.json", JSON.stringify(data1));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  });
