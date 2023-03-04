export interface Logger {
    log(message: string, context? : any): void;
    error(message: string, err?: Error): void;
    warn(message: string, context? : any): void;
    debug(message: string, context? : any): void;
}
export class ConsoleLogger implements Logger {
    private boundary = '-------------------------------------';
    
    debug(message: string, context?: any): void {
        console.debug(this.boundary);
        console.debug(message, {context});
        console.debug(this.boundary);
    }

    log(message: string, context?: any): void {
        console.log(this.boundary);
        console.log(message, {context});
        console.log(this.boundary);
    }
    error(message: string, err?: Error): void {
        console.error(this.boundary);
        console.error(message, {err});
        console.error(this.boundary);

    }
    warn(message: string, context?: any): void {
        console.warn(this.boundary);
        console.warn(message, {context});
        console.warn(this.boundary);
    }

}

export const logger : Logger = new ConsoleLogger();