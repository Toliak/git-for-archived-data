// TODO: make the separated files

import path from 'path';
import { askToUserConfirm } from './utils.js';
import fs from 'fs';

const templateJSON = `{
    "$schema": "https://raw.githubusercontent.com/Toliak/git-for-archived-data/develop/git-for-archived-data.schema.json",
    "config": {},
    "items": [
        {
            "archive": {
                "path": "SampleDocument.docx",
                "watching": true,
                "format": "zip"
            },
            "raw": {
                "path": "SampleDocumentResult",
                "applyPrettier": true
            }
        }
    ]
}
`;

const templatePrettierRC = `{
    "$schema": "https://json.schemastore.org/prettierrc",
    "arrowParens": "avoid",
    "singleQuote": true,
    "trailingComma": "all",
    "tabWidth": 4,
    "printWidth": 80,
    "semi": true,

    "plugins": ["prettier-plugin-xml-msword"],
    "xmlWhitespaceSensitivity": "strict",
    "xmlSelfClosingSpace": true,
    "xmlExpandSelfClosingTags": true
}
`;

type InitializeFunctionType = (filePath: string) => void;
const initializeFunctions: Record<string, InitializeFunctionType> = {
    'git-for-archived-data.json': filePath => {
        fs.writeFileSync(filePath, templateJSON, 'utf8');
    },
    '.prettierrc': filePath => {
        fs.writeFileSync(filePath, templatePrettierRC, 'utf8');
    },
};

export async function initializeDirectory(dirPath: string) {
    for (const [fileLocalPath, callback] of Object.entries(
        initializeFunctions,
    )) {
        const fullPath = path.resolve(dirPath, fileLocalPath);

        if (fs.existsSync(fullPath)) {
            console.log(
                `> \x1b[34m${fullPath}\x1b[0m already exists. Replace?`,
            );
            const result = await askToUserConfirm();
            if (!result) {
                console.log(`> Skipped \x1b[34m${fullPath}\x1b[0m`);
                continue;
            }
        }

        callback(fullPath);
    }
}
