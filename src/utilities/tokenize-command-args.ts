const QUOTES_AND_WHITESPACE = RegExp(/ [“].*?[”]|['].*?[']|["].*?["]|[`].*?[`]|[^\s]+/, 'g');

export function tokenizeCommandArgs(commandArgs: string) {
    let results: string[];
    const userArgs: string[] = [];
    while ((results = QUOTES_AND_WHITESPACE.exec(commandArgs)) != null) {
        userArgs.push(results[0]);
    }
    return userArgs;
}
