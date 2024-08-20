const fs = require("fs");
const path = require("path");

const directotyPath = path.join(__dirname, '/src/entities_from_db/entities');

fs.readdir(directotyPath, (err, files) => {
    if (err) {
        console.error("Enable to read directory: ", directotyPath);
        console.error(err);
        return;
    }

    files.forEach(file => {
        const oldFile = path.join(directotyPath, file);
        const newFile = file.toLowerCase().replace(".ts", ".entity.ts");
        const newFilePath = path.join(directotyPath, newFile);

        // rename file
        fs.rename(oldFile, newFilePath, err => {
            console.log("File renaming: ", file, " -> ", newFilePath, err ? "❌" : "✅");
            err && console.log(err);

            // update imports
            fs.readFile(newFilePath, 'utf-8', (err, data) => {
                if (err) {
                    console.error("Enable to read file: ", newFile);
                    console.error(err);
                    return;
                }

                const updatedData = data.replace(/from "\.\/(\w+)";/g, (match, p1) => {
                    return `from "./${p1.toLowerCase()}.entity";`;
                });

                fs.writeFile(newFilePath, updatedData, 'utf-8', (err) => {
                    if (err) {
                        console.log('Error writing file: ' + err);
                      } else {
                        console.log(`Updated imports in: ${path.basename(newPath)}`);
                      }
                });
            });
        });
    })
});