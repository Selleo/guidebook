import path from "path";
import fs from "fs";
import * as parser from "@babel/parser";
import * as traverse from "@babel/traverse"; // Correct import
import * as generate from "@babel/generator";
import template from "@babel/template";
import {
  importDeclaration,
  importDefaultSpecifier,
  exportNamedDeclaration,
  variableDeclaration,
  variableDeclarator,
  callExpression,
  identifier,
  stringLiteral, // Import stringLiteral
} from "@babel/types";

module.exports = function myTsupPlugin() {
  const xd = template.default(`import UserDialog from "./user-dialog";`, {
    sourceType: "module",
  });

  const xdd = generate.default.default(
    xd,
    {
      /* options */
    },
    xd.code,
  );

  console.log(xdd.code);

  // console.log(
  //   "myTsupPlugin",
  // );
  return {
    name: "dynamic-template-exports",
    buildEnd: () => {
      const templatesDir = path.resolve(__dirname, "src", "templates"); // Adjust path if needed
      const indexFilePath = path.resolve(__dirname, "index.ts");

      const templateFiles = fs
        .readdirSync(templatesDir)
        .filter((file) => file.endsWith(".tsx") && file !== "index.ts");

      const ast = parser.parse(fs.readFileSync(indexFilePath, "utf-8"), {
        sourceType: "module",
        plugins: ["typescript"], // Ensure TypeScript parsing
      });

      traverse.default.default(ast, {
        Program(path) {
          const body = path.get("body");

          templateFiles.forEach((templateFile) => {
            const templateName = templateFile.replace(".tsx", "");
            const variableName =
              templateName.charAt(0).toUpperCase() + templateName.slice(1);

            // Create the import declaration AST node (Corrected)
            const importSpecifier = importDefaultSpecifier(
              identifier(`${variableName}Template`),
            );
            const importDeclarationNode = importDeclaration(
              [importSpecifier],
              stringLiteral(`./templates/${templateName}`), // Use stringLiteral here
            );

            // Create the export declaration AST node
            const exportDeclarationNode = exportNamedDeclaration(
              variableDeclaration("const", [
                variableDeclarator(
                  identifier(variableName),
                  callExpression(identifier("emailTemplateFactory"), [
                    identifier(`${variableName}Template`),
                  ]),
                ),
              ]),
              [],
            );

            body.push(importDeclarationNode);
            body.push(exportDeclarationNode);
          });
        },
      });

      console.log(ast);

      const output = generate.default.default(
        ast,
        {
          /* options */
        },
        ast.code,
      );

      fs.writeFileSync(indexFilePath, output.code, "utf-8");
    },
  };
};
