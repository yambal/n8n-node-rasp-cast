"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaspCastApi = void 0;
class RaspCastApi {
    constructor() {
        this.name = 'raspCastApi';
        this.displayName = 'Rasp-Cast API';
        this.documentationUrl = 'https://github.com/yambal/rasp-cast';
        this.properties = [
            {
                displayName: 'Server URL',
                name: 'serverUrl',
                type: 'string',
                default: 'http://localhost:3000',
                placeholder: 'http://192.168.1.96:3000',
                description: 'The base URL of the Rasp-Cast server',
                required: true,
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                description: 'The API key for authenticated operations (Bearer token)',
                required: true,
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
    }
}
exports.RaspCastApi = RaspCastApi;
//# sourceMappingURL=RaspCastApi.credentials.js.map