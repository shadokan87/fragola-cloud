import { ExecException, execSync } from "child_process";
import z from "zod";
import { grepCodeBaseSchema } from "./grepCodebase.tool";
import path from "path";
import { allIdToPath } from "../../services/treeService";

export function grepCodebaseInternal(projectRoot: string, params: z.infer<typeof grepCodeBaseSchema>): string[] | ExecException {
    const rgPath = "/usr/bin/rg";
    const { includeFile, excludeFile, content } = params;
    let stdout: string = "";

    let command = [`${rgPath}`, '--count', '--with-filename', '--ignore-case'];

    if (includeFile) {
        command.push('--glob', includeFile);
    }

    if (excludeFile) {
        command.push('--glob', `!${excludeFile}`);
    }

    command.push(content, projectRoot);
    // const getFileIdFromRelativePath = (relPath: string): string | undefined => {
    //     const fullPath = join(projectRoot, relPath);
    //     let result: string | undefined;
    //     const idToPath = allIdToPath.get(params.tokenType)

    // }

    try {
        // bun '$' inline commands don't work well for this, so we use nodejs
        stdout = execSync(command.join(' '), { encoding: 'utf-8', cwd: projectRoot });
        
        // Format output to use relative paths from projectRoot
        const lines = stdout.split('\n').filter(line => line.trim());
        const formattedLines = lines.map(line => {
            const colonIndex = line.lastIndexOf(':');
            if (colonIndex !== -1) {
                const filePath = line.substring(0, colonIndex);
                const count = line.substring(colonIndex + 1);
                const relativePath = path.relative(projectRoot, filePath);
                return `${relativePath}:${count}`;
            }
            return line;
        });
        return formattedLines;
    } catch (e) {
        return e as ExecException;
    }
}