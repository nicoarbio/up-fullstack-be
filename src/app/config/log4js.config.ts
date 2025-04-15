import * as log4js from 'log4js';
import { createNamespace } from 'cls-hooked';

const requestNamespace = createNamespace('log-context');

export enum MDCKeys {
    USER_ID = 'userId'
}

export const MDC = {
    run: (fn: () => void) => {
        requestNamespace.run(fn);
    },
    set: (key: MDCKeys, value: any) => {
        requestNamespace.active && requestNamespace.set(key, value);
    },
    get: (key: string) => {
        return requestNamespace.active ? requestNamespace.get(key) : '';
    }
};

log4js.configure({
    appenders: {
        console: {
            type: 'console',
            layout: {
                type: 'pattern',
                pattern: '%[%d - [%x{user}] - %p%] - %m',
                tokens: { user: () => requestNamespace.get('userId') || '' }
            }
        },
        file: {
            type: 'fileSync',
            filename: 'app.log',
            maxLogSize: 10485760,
            numBackups: 3,
            layout: {
                type: 'pattern',
                pattern: '%d - [%x{user}] - %p - %m',
                tokens: { user: () => requestNamespace.get('userId') || '' }
            }
        }
    },
    categories: {
        default: { appenders: ['console', 'file'], level: 'debug' },
    }
});

const logger = log4js.getLogger();
const { info, error, warn, debug } = logger;
console.log = info.bind(logger);
console.error = error.bind(logger);
console.warn = warn.bind(logger);
console.debug = debug.bind(logger);
