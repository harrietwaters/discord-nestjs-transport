export function setClassName<T>(ctr: T, newName: string): T {
    Object.defineProperty(ctr, 'name', { writable: true });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ctr.name = newName;
    Object.defineProperty(ctr, 'name', { writable: false });
    return ctr;
}
