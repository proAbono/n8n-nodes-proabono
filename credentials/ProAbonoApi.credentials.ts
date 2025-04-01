import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ProAbonoApi implements ICredentialType {
	name = 'proAbonoApi';
	displayName = 'ProAbono API';
	documentationUrl = 'https://docs.proabono.com/api/';
	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: 'Agent Key',
			name: 'agentKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		{
			displayName: 'Business ID',
			name: 'businessId',
			type: 'number',
			default: null,
			required: true,
			description: 'Your ProAbono Business ID',
		},
		{
			displayName: 'Webhook Security Key',
			name: 'webhookSecurityKey',
			type: 'string',
			typeOptions: { password: true },
			default: null,
			required: true,
		},
	];

	// This credential is currently not used by any node directly
	// but the HTTP Request node can use it to make requests.
	// The credential is also testable due to the `test` property below
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{ $credentials.agentKey }}',
				password: '={{ $credentials.apiKey }}',
			},
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{"https://api-" + $credentials.businessId + ".proabono.com/v1"}}',
			url: '/customers',
			method: 'GET',
		},
	};
}
