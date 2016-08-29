declare module 'LibStub' {
    interface LibStub{
        NewLibrary(major:string, minor: string):any;
        GetLibrary(major:string, silent?: boolean):any;
    }

    const libStub:LibStub;
    export default libStub;
}