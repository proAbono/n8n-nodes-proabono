import type { IDataObject, INodeProperties } from 'n8n-workflow';

// import { subscriptionAdditionalFieldsOptions } from './descriptions/Subscription/SubscriptionAdditionalFieldsOptions';
import { subscriptionAdditionalFieldsOptions } from './SubscriptionAdditionalFieldsOptions';
import { extractBody, } from '../../ProAbonoApi';

export const subscriptionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'createSubscription',
		options: [
			// Create a Subscription
			{
				name: 'Create a Subscription',
				value: 'createSubscription',
				description: 'Creates a new Subscription',
				action: 'Create a subscription',
				routing: {
					request: {
						method: 'POST',
						url: '/Subscription',
					},
					output: {
						postReceive: [
							async function (this, items, response) {
								return extractBody(response);
							},
						],
					},
				},
			},
      // Retrieve a Subscription
			{
				name: 'Retrieve a Subscription',
				value: 'retrieveSubscriptionByID',
				description: 'Retrieves a Subscription by Subscription ID',
				action: 'Retrieve a subscription',
				routing: {
					request: {
						method: 'GET',
						url: '=/Subscription/{{$parameter["IdSubscription"]}}',
					},
					output: {
						postReceive: [
							async function (this, items, response) {
								return extractBody(response);
							},
						],
					},
				},
			},
      // Start a Subscription or Restart a Subscription
			{
				name: 'Start a Subscription or Restart a Subscription',
				value: 'startSubscription',
				description: 'Starts a Subscription',
				action: 'Start a subscription or restart a subscription',
				routing: {
					request: {
						method: 'POST',
						url: '=/Subscription/{{$parameter["IdSubscription"]}}/Start',
					},
					output: {
						postReceive: [
							async function (this, items, response) {
								return extractBody(response);
							},
						],
					},
				},
			},
      // Upgrade a Subscription
			{
				name: 'Upgrade a Subscription',
				value: 'upgradeSubscription',
				description: 'Upgrades a Subscription',
				action: 'Upgrade a subscription',
				routing: {
					request: {
						method: 'POST',
						url: '=/Subscription/{{$parameter["IdSubscription"]}}/Upgrade',
					},
					output: {
						postReceive: [
							async function (this, items, response) {
								return extractBody(response);
							},
						],
					},
				},
			},
      // Suspend a Subscription
			{
				name: 'Suspend a Subscription',
				value: 'suspendSubscription',
				description: 'Suspends a Subscription',
				action: 'Suspend a subscription',
				routing: {
					request: {
						method: 'POST',
						url: '=/Subscription/{{$parameter["IdSubscription"]}}/Suspension',
					},
					output: {
						postReceive: [
							async function (this, items, response) {
								return extractBody(response);
							},
						],
					},
				},
			},
      // Terminate a Subscription
			{
				name: 'Terminate a Subscription',
				value: 'terminateSubscription',
				description: 'Terminates a Subscription',
				action: 'Terminate a subscription',
				routing: {
					request: {
						method: 'POST',
						url: '=/Subscription/{{$parameter["IdSubscription"]}}/Termination',
					},
					output: {
						postReceive: [
							async function (this, items, response) {
								return extractBody(response);
							},
						],
					},
				},
			},
			// Add Usage Quantity
			{
				name: 'Add Usage Quantity',
				value: 'addUsageQuantity',
				description: 'Adds a new usage quantity to the Current Quantity of a Feature related to a Customer',
				action: 'Add usage quantity',
				routing: {
					request: {
						method: 'POST',
						url: '/Usage',
						body: {
							DateTime: '={{new Date().toISOString()}}',
						}
					},
					output: {
						postReceive: [
							async function (this, items, response) {
								return [
									{
										json: response.body as IDataObject,
									},
								];
							},
						],
					},
				},
			},
			// Enable/Disable a Feature
			{
				name: 'Enable/Disable a Feature',
				value: 'enableDisableFeature',
				description: 'Enables or Disables a Feature (Only for OnOff feature) in the active subscription of a Customer',
				action: 'Enable disable a feature',
				routing: {
					request: {
						method: 'POST',
						url: '/Usage',
						body: {
							DateTime: '={{new Date().toISOString()}}',
						}
					},
					output: {
						postReceive: [
							async function (this, items, response) {
								return [
									{
										json: response.body as IDataObject,
									},
								];
							},
						],
					},
				},
			},
		],
		displayOptions: {
			show: {
				resource: [
					'subscription',
				],
			},
		},
	},
];

export const subscriptionFields: INodeProperties[] = [
	// Field 'Reference Customer'
	{
		displayName: 'Reference Customer',
		name: 'ReferenceCustomer',
		type: 'string',
		required: true,
		default: '',
		description: 'The unique identifier used within your own application for this customer',
		displayOptions: {
			show: {
				resource: ['subscription',],
				operation: [
					'createSubscription',
					'addUsageQuantity',
					'enableDisableFeature',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'ReferenceCustomer',
			},
		},
	},
	// Field 'Reference Offer'
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
		displayName: 'Offer Name or ReferenceOffer',
		name: 'ReferenceOffer',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getOffers',
		},
		required: true,
		default: '',
		// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
		description: 'Choose from the list, or specify a ReferenceOffer using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: ['subscription',],
				operation: [
					'createSubscription',
					'upgradeSubscription',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'ReferenceOffer',
			},
		},
	},
	// Field 'ID Subscription '
	{
		displayName: 'Subscription ID',
		name: 'IdSubscription',
		type: 'number',
		required: true,
		default: null,
		description: 'ID of the subscription',
		displayOptions: {
			show: {
				resource: ['subscription',],
				operation: [
					'retrieveSubscriptionByID',
					'startSubscription',
					'suspendSubscription',
					'terminateSubscription',
					'upgradeSubscription',
				],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'IdSubscription',
			},
		},
	},
	// Additional Fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['createSubscription'],
			},
		},
		options: subscriptionAdditionalFieldsOptions,
	},
	// Field 'Immediate' (Termination)
	{
		displayName: 'When to Apply the Termination?',
		name: 'Immediate',
		type: 'options',
		default: false,
		description: 'Choose whether the termination should take effect immediately or at the end of the current term. By default, terminations are applied at the end of the billing period.',
		displayOptions: {
			show: {
				resource: ['subscription',],
				operation: [
					'terminateSubscription',
				],
			},
		},
		options: [
			{
				name: 'Immediately',
				value: true,
			},
			{
				name: 'At the End of the Current Term (Default)',
				value: false,
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'Immediate',
			},
		},
	},
	// Field 'Immediate' (Upgrade)
	{
		displayName: 'When to Apply the Upgrade?',
		name: 'Immediate',
		type: 'options',
		default: false,
		description: 'Choose whether the upgrade should be applied immediately or at the end of the current term. By default, upgrades are applied at the end of the billing period.',
		displayOptions: {
			show: {
				resource: ['subscription',],
				operation: [
					'upgradeSubscription',
				],
			},
		},
		options: [
			{
				name: 'Immediately',
				value: true,
			},
			{
				name: 'At the End of the Current Term',
				value: false,
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'Immediate',
			},
		},
	},
	// Field 'IgnoreEngagement' (Upgrade)
	{
		displayName: 'Ignore Minimum Commitment?',
		name: 'IgnoreEngagement',
		type: 'options',
		default: false,
		description: 'Whether to allow the upgrade even if the subscription is still within its minimum commitment period. For example, a monthly subscription with a 12-month commitment cannot usually be upgraded during the first 12 months.',
		displayOptions: {
			show: {
				resource: ['subscription',],
				operation: [
					'upgradeSubscription',
				],
			},
		},
		options: [
			{
				name: 'Yes, Ignore Any Commitment',
				value: true,
			},
			{
				name: 'No, Respect the Commitment Period',
				value: false,
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'IgnoreEngagement',
			},
		},
	},
	// Field 'BillNow' (Upgrade)
	{
		displayName: 'When to Bill the Upgrade?',
		name: 'BillNow',
		type: 'options',
		default: false,
		description: 'Choose whether the upgrade should be billed immediately or at the next renewal (i.e., at the end of the current billing period)',
		displayOptions: {
			show: {
				resource: ['subscription',],
				operation: [
					'upgradeSubscription',
				],
			},
		},
		options: [
			{
				name: 'Immediately',
				value: true,
			},
			{
				name: 'At the End of the Current Term',
				value: false,
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'BillNow',
			},
		},
	},
	// Field 'Reference Feature' (Limitation and Consumption)
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
		displayName: 'Feature Name or ReferenceFeature',
		name: 'ReferenceFeature',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getFeatures',
		},
		required: true,
		default: '',
		// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
		description: 'Choose from the list, or specify a ReferenceFeature using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: ['subscription',],
				operation: [
					'addUsageQuantity',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'ReferenceFeature',
			},
		},
	},
	// Field 'Reference Feature' (OnOff)
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
		displayName: 'Feature Name or ReferenceFeature',
		name: 'ReferenceFeature',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getOnOffFeatures',
		},
		required: true,
		default: '',
		// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
		description: 'Choose from the list, or specify a ReferenceFeature using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: ['subscription',],
				operation: [
					'enableDisableFeature',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'ReferenceFeature',
			},
		},
	},
	// Field 'Increment'
	{
		displayName: 'Increment',
		name: 'Increment',
		type: 'number',
		required: true,
		default: '',
		description: 'Adds this quantity to the current quantity of the feature',
		displayOptions: {
			show: {
				resource: ['subscription',],
				operation: [
					'addUsageQuantity',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'Increment',
			},
		},
	},
	// Field 'IsEnabled'
	{
		displayName: 'Enabled It?',
		name: 'IsEnabled',
		type: 'boolean',
		default: true,
		description: 'Whether the feature will be enabled for the customer',
		displayOptions: {
			show: {
				resource: ['subscription',],
				operation: [
					'enableDisableFeature',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'IsEnabled',
			},
		},
	},
];
