import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RaspCastApi implements ICredentialType {
	name = 'raspCastApi';
	displayName = 'Rasp-Cast API';
	documentationUrl = 'https://github.com/yambal/rasp-cast';

	properties: INodeProperties[] = [
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

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};
}
