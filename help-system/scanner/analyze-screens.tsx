import fs from "fs";
import path from "path";

interface UIElement {
    type: string;
    text?: string;
    name?: string;
    placeholder?: string;
    handler?: string;
    file: string;
}

interface ScreenAnalysis {
    name: string;
    route: string;
    page_file: string;
    source_files: string[];
    elements: UIElement[];
}

interface Output {
    generated_at: string;
    total_screens: number;
    screens: ScreenAnalysis[];
}

const PROJECT_ROOT = process.cwd();

const APP_DIR = path.join(
    PROJECT_ROOT,
    "src",
    "app"
);

const OUTPUT_FILE = path.join(
    PROJECT_ROOT,
    "help-system",
    "screen-analysis.json"
);

const IGNORE_DIRECTORIES = new Set([
    "node_modules",
    ".next",
    ".git",
    "public",
    "api",
]);

const SOURCE_EXTENSIONS = [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
];

function isSourceFile(file: string): boolean {
    return SOURCE_EXTENSIONS.includes(
        path.extname(file)
    );
}

function cleanText(value: string): string {
    return value
        .replace(/\s+/g, " ")
        .trim();
}


/* =========================================================
   SOURCE FILE RESOLUTION
   ========================================================= */

function resolveImport(
    importerFile: string,
    importPath: string
): string | null {

    /*
     * Ignore external packages.
     *
     * Examples:
     * react
     * next/link
     * axios
     * @mui/material
     */

    if (
        !importPath.startsWith(".") &&
        !importPath.startsWith("@/")
    ) {
        return null;
    }

    let basePath: string;

    /*
     * Support @ alias.
     *
     * Example:
     *
     * @/components/CustomerForm
     *
     * becomes:
     *
     * src/components/CustomerForm
     */

    if (
        importPath.startsWith("@/")
    ) {

        basePath = path.join(
            PROJECT_ROOT,
            "src",
            importPath.substring(2)
        );

    } else {

        basePath = path.resolve(
            path.dirname(importerFile),
            importPath
        );
    }

    /*
     * Direct file
     */

    if (
        fs.existsSync(basePath) &&
        fs.statSync(basePath).isFile()
    ) {

        return basePath;
    }

    /*
     * Try extensions
     */

    for (
        const extension
        of SOURCE_EXTENSIONS
    ) {

        const candidate =
            basePath + extension;

        if (
            fs.existsSync(candidate)
        ) {

            return candidate;
        }
    }

    /*
     * Try directory/index
     */

    if (
        fs.existsSync(basePath) &&
        fs.statSync(basePath).isDirectory()
    ) {

        for (
            const extension
            of SOURCE_EXTENSIONS
        ) {

            const candidate =
                path.join(
                    basePath,
                    "index" + extension
                );

            if (
                fs.existsSync(candidate)
            ) {

                return candidate;
            }
        }
    }

    return null;
}


/* =========================================================
   IMPORT EXTRACTION
   ========================================================= */

function extractImports(
    source: string
): string[] {

    const imports: string[] = [];

    /*
     * import Something from "./Something"
     */

    const importRegex =
        /import\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;

    let match: RegExpExecArray | null;

    while (
        (match = importRegex.exec(source)) !== null
    ) {

        imports.push(
            match[1]
        );
    }


    /*
     * require("./Something")
     */

    const requireRegex =
        /require\s*\(\s*["']([^"']+)["']\s*\)/g;

    while (
        (match = requireRegex.exec(source)) !== null
    ) {

        imports.push(
            match[1]
        );
    }


    return Array.from(
        new Set(imports)
    );
}


/* =========================================================
   RECURSIVE DEPENDENCY SCANNER
   ========================================================= */

function collectDependencies(
    entryFile: string,
    visited = new Set<string>()
): string[] {

    const dependencies: string[] = [];

    const normalized =
        path.normalize(entryFile);

    if (
        visited.has(normalized)
    ) {

        return dependencies;
    }

    visited.add(normalized);

    if (
        !fs.existsSync(normalized)
    ) {

        return dependencies;
    }

    if (
        !fs.statSync(normalized).isFile()
    ) {

        return dependencies;
    }

    if (
        !isSourceFile(normalized)
    ) {

        return dependencies;
    }

    dependencies.push(
        normalized
    );

    let source: string;

    try {

        source =
            fs.readFileSync(
                normalized,
                "utf8"
            );

    } catch {

        return dependencies;
    }

    const imports =
        extractImports(source);

    for (
        const importPath
        of imports
    ) {

        const resolved =
            resolveImport(
                normalized,
                importPath
            );

        if (
            !resolved
        ) {

            continue;
        }

        /*
         * Don't scan these directories.
         */

        const relative =
            path.relative(
                PROJECT_ROOT,
                resolved
            );

        const parts =
            relative.split(
                path.sep
            );

        if (
            parts.some(
                part =>
                    IGNORE_DIRECTORIES.has(
                        part
                    )
            )
        ) {

            continue;
        }

        dependencies.push(
            ...collectDependencies(
                resolved,
                visited
            )
        );
    }

    return dependencies;
}


/* =========================================================
   UI ELEMENT EXTRACTION
   ========================================================= */

function extractUIElements(
    source: string,
    filePath: string
): UIElement[] {

    const elements: UIElement[] = [];

    let match: RegExpExecArray | null;


    /*
     * BUTTON
     */

    const buttonRegex =
        /<(Button|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi;

    while (
        (match = buttonRegex.exec(source)) !== null
    ) {

        const attributes =
            match[2] || "";

        const content =
            match[3] || "";

        const text =
            cleanText(
                content.replace(
                    /<[^>]+>/g,
                    ""
                )
            );

        const handlerMatch =
            attributes.match(
                /onClick\s*=\s*\{\s*([A-Za-z0-9_$]+)/
            );

        const handler =
            handlerMatch
                ? handlerMatch[1]
                : undefined;

        if (
            text ||
            handler
        ) {

            elements.push({

                type: "button",

                text:
                    text || undefined,

                handler,

                file: filePath,
            });
        }
    }


    /*
     * INPUT
     */

    const inputRegex =
        /<(Input|input)\b([^>]*)\/?>/gi;

    while (
        (match = inputRegex.exec(source)) !== null
    ) {

        const attributes =
            match[2] || "";

        const nameMatch =
            attributes.match(
                /\bname\s*=\s*["']([^"']+)["']/
            );

        const placeholderMatch =
            attributes.match(
                /\bplaceholder\s*=\s*["']([^"']+)["']/
            );

        const typeMatch =
            attributes.match(
                /\btype\s*=\s*["']([^"']+)["']/
            );

        elements.push({

            type:
                typeMatch
                    ? `input:${typeMatch[1]}`
                    : "input",

            name:
                nameMatch
                    ? nameMatch[1]
                    : undefined,

            placeholder:
                placeholderMatch
                    ? placeholderMatch[1]
                    : undefined,

            file: filePath,
        });
    }


    /*
     * TEXTAREA
     */

    const textareaRegex =
        /<(Textarea|textarea)\b([^>]*)\/?>/gi;

    while (
        (match = textareaRegex.exec(source)) !== null
    ) {

        const attributes =
            match[2] || "";

        const nameMatch =
            attributes.match(
                /\bname\s*=\s*["']([^"']+)["']/
            );

        const placeholderMatch =
            attributes.match(
                /\bplaceholder\s*=\s*["']([^"']+)["']/
            );

        elements.push({

            type: "textarea",

            name:
                nameMatch
                    ? nameMatch[1]
                    : undefined,

            placeholder:
                placeholderMatch
                    ? placeholderMatch[1]
                    : undefined,

            file: filePath,
        });
    }


    /*
     * SELECT
     */

    const selectRegex =
        /<(Select|select)\b([^>]*)/gi;

    while (
        (match = selectRegex.exec(source)) !== null
    ) {

        const attributes =
            match[2] || "";

        const nameMatch =
            attributes.match(
                /\bname\s*=\s*["']([^"']+)["']/
            );

        elements.push({

            type: "select",

            name:
                nameMatch
                    ? nameMatch[1]
                    : undefined,

            file: filePath,
        });
    }


    /*
     * LINKS
     */

    const linkRegex =
        /<(Link|a)\b([^>]*)>([\s\S]*?)<\/\1>/gi;

    while (
        (match = linkRegex.exec(source)) !== null
    ) {

        const attributes =
            match[2] || "";

        const content =
            match[3] || "";

        const text =
            cleanText(
                content.replace(
                    /<[^>]+>/g,
                    ""
                )
            );

        const hrefMatch =
            attributes.match(
                /\bhref\s*=\s*["']([^"']+)["']/
            );

        if (
            text ||
            hrefMatch
        ) {

            elements.push({

                type: "link",

                text:
                    text || undefined,

                name:
                    hrefMatch
                        ? hrefMatch[1]
                        : undefined,

                file: filePath,
            });
        }
    }


    /*
     * LABEL
     */

    const labelRegex =
        /<(Label|label)\b([^>]*)>([\s\S]*?)<\/\1>/gi;

    while (
        (match = labelRegex.exec(source)) !== null
    ) {

        const content =
            match[3] || "";

        const text =
            cleanText(
                content.replace(
                    /<[^>]+>/g,
                    ""
                )
            );

        if (text) {

            elements.push({

                type: "label",

                text,

                file: filePath,
            });
        }
    }


    /*
     * HEADINGS
     */

    const headingRegex =
        /<(h1|h2|h3|h4|h5|h6)\b[^>]*>([\s\S]*?)<\/\1>/gi;

    while (
        (match = headingRegex.exec(source)) !== null
    ) {

        const text =
            cleanText(
                match[2].replace(
                    /<[^>]+>/g,
                    ""
                )
            );

        if (text) {

            elements.push({

                type: "heading",

                text,

                file: filePath,
            });
        }
    }


    return elements;
}


/* =========================================================
   FIND NEXT.JS PAGES
   ========================================================= */

function findPages(
    directory: string
): string[] {

    const pages: string[] = [];

    if (
        !fs.existsSync(directory)
    ) {

        return pages;
    }

    const entries =
        fs.readdirSync(
            directory,
            {
                withFileTypes: true,
            }
        );

    for (
        const entry
        of entries
    ) {

        if (
            IGNORE_DIRECTORIES.has(
                entry.name
            )
        ) {

            continue;
        }

        const fullPath =
            path.join(
                directory,
                entry.name
            );

        if (
            entry.isDirectory()
        ) {

            pages.push(
                ...findPages(
                    fullPath
                )
            );

            continue;
        }

        if (
            entry.isFile() &&
            [
                "page.tsx",
                "page.ts",
                "page.jsx",
                "page.js",
            ].includes(entry.name)
        ) {

            pages.push(
                fullPath
            );
        }
    }

    return pages;
}


/* =========================================================
   PAGE → ROUTE
   ========================================================= */

function pageToRoute(
    pageFile: string
): string {

    const relativePath =
        path.relative(
            APP_DIR,
            pageFile
        );

    const directory =
        path.dirname(
            relativePath
        );

    if (
        directory === "." ||
        directory === ""
    ) {

        return "/";
    }

    const parts =
        directory
            .split(path.sep)
            .filter(Boolean)
            .filter(
                part =>
                    !(
                        part.startsWith("(") &&
                        part.endsWith(")")
                    )
            );

    if (
        parts.length === 0
    ) {

        return "/";
    }

    return "/" + parts.join("/");
}


/* =========================================================
   ANALYZE SCREEN
   ========================================================= */

function analyzeScreen(
    pageFile: string
): ScreenAnalysis {

    const route =
        pageToRoute(pageFile);

    const routeName =
        route === "/"
            ? "Home"
            : route
                .split("/")
                .filter(Boolean)
                .pop() || "Screen";


    /*
     * Follow only imports belonging
     * to this screen.
     */

    const sourceFiles =
        collectDependencies(
            pageFile
        );


    const elements: UIElement[] = [];

    for (
        const sourceFile
        of sourceFiles
    ) {

        try {

            const source =
                fs.readFileSync(
                    sourceFile,
                    "utf8"
                );

            const relativeFile =
                path.relative(
                    PROJECT_ROOT,
                    sourceFile
                );

            elements.push(
                ...extractUIElements(
                    source,
                    relativeFile
                )
            );

        } catch {

            console.warn(
                `Could not read ${sourceFile}`
            );
        }
    }


    /*
     * Remove duplicate elements.
     */

    const uniqueElements =
        Array.from(
            new Map(
                elements.map(
                    element => [
                        JSON.stringify(
                            element
                        ),
                        element,
                    ]
                )
            ).values()
        );


    return {

        name:
            routeName,

        route,

        page_file:
            path.relative(
                PROJECT_ROOT,
                pageFile
            ),

        source_files:
            sourceFiles.map(
                file =>
                    path.relative(
                        PROJECT_ROOT,
                        file
                    )
            ),

        elements:
            uniqueElements,
    };
}


/* =========================================================
   MAIN
   ========================================================= */

function main(): void {

    console.log(
        "=========================================="
    );

    console.log(
        "Screen-Aware Next.js Help Analyzer"
    );

    console.log(
        "=========================================="
    );

    console.log(
        `Project: ${PROJECT_ROOT}`
    );

    console.log(
        `App directory: ${APP_DIR}`
    );

    if (
        !fs.existsSync(APP_DIR)
    ) {

        console.error(
            "ERROR: src/app directory not found."
        );

        process.exit(1);
    }


    const pages =
        findPages(APP_DIR);

    console.log(
        `Screens found: ${pages.length}`
    );

    console.log("");


    const screens: ScreenAnalysis[] = [];

    for (
        const pageFile
        of pages
    ) {

        const screen =
            analyzeScreen(
                pageFile
            );

        screens.push(
            screen
        );

        console.log(
            `✓ ${screen.route}`
        );

        console.log(
            `  Source files: ${screen.source_files.length}`
        );

        console.log(
            `  UI elements: ${screen.elements.length}`
        );

        console.log("");
    }


    screens.sort(
        (a, b) =>
            a.route.localeCompare(
                b.route
            )
    );


    const output: Output = {

        generated_at:
            new Date().toISOString(),

        total_screens:
            screens.length,

        screens,
    };


    const outputDirectory =
        path.dirname(
            OUTPUT_FILE
        );

    if (
        !fs.existsSync(
            outputDirectory
        )
    ) {

        fs.mkdirSync(
            outputDirectory,
            {
                recursive: true,
            }
        );
    }


    fs.writeFileSync(
        OUTPUT_FILE,
        JSON.stringify(
            output,
            null,
            2
        ),
        "utf8"
    );


    console.log(
        "=========================================="
    );

    console.log(
        "Analysis completed successfully"
    );

    console.log(
        `Output: ${OUTPUT_FILE}`
    );

    console.log(
        "=========================================="
    );
}


main();