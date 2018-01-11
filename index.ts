import * as JSON5 from 'json5';

function readStdin() {
    process.stdin.setEncoding('utf8');
    return new Promise<string>(resolve => {
        let buf = '';
        process.stdin.on('data', chunk => {
            buf += chunk;
        });
        process.stdin.on('end', () => {
            resolve(buf);
        });
    });
}

export interface Config {
    write?: boolean;
    indent?: number;
    minify?: boolean;
}

export default class FixJSON {
    public readonly config: Config;

    constructor(config?: Config) {
        this.config = Object.assign({ write: false, indent: 2, minify: false }, config || {});
    }

    async run(paths: string[]) {
        const stdin = paths.length === 0;
        if (stdin) {
            const obj = await this.requireStdin();
            process.stdout.setEncoding('utf8');
            this.writeAsJson(process.stdout, obj);
        } else {
            throw new Error('Fixing file is not implemented yet');
        }
    }

    async runString(input: string) {
        const obj = JSON5.parse(input);
        process.stdout.setEncoding('utf8');
        this.writeAsJson(process.stdout, obj);
    }

    private async writeAsJson(writer: NodeJS.WriteStream, obj: any) {
        const { indent, minify } = this.config;
        const level = minify ? 0 : indent || 2;
        writer.write(JSON.stringify(obj, null, level) + '\n');
    }

    private async requireStdin() {
        return JSON5.parse(await readStdin());
    }
}

export function fix(input: string, config?: Config) {
    return new FixJSON(config).runString(input);
}

// TODO: export function fixFile
