import {
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	customerFields,
	customerOperations,
} from './descriptions/Customer/CustomerDescriptions';

import {
	subscriptionFields,
	subscriptionOperations,
} from './descriptions/Subscription/SubscriptionDescriptions';

import {
	invoiceFields,
	invoiceOperations,
} from './descriptions/Invoice/InvoiceDescriptions';

import {
	getSegments,
	getOffers,
	getFeatures,
	getOnOffFeatures,
} from './ProAbonoApi';

export class ProAbono implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ProAbono',
		name: 'proAbono',
		icon: 'file:proabono.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with ProAbono API',
		defaults: {
			name: 'ProAbono',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'proAbonoApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{`https://api-${$credentials.businessId}.proabono.com/v1`}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			auth: {
				username: '={{$credentials.agentKey}}',
				password: '={{$credentials.apiKey}}',
			},
		},

		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Subscription',
						value: 'subscription',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
				],
				default: 'customer',
			},
			...customerOperations,
			...customerFields,
			...subscriptionOperations,
			...subscriptionFields,
			...invoiceOperations,
			...invoiceFields,
		],
	};

	methods = {
		loadOptions: {
			getSegments,
			getOffers,
			getFeatures,
			getOnOffFeatures,
		},
	};
}

