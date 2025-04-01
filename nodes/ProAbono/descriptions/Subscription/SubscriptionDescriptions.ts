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
		displayName: 'Offer Name or ReferenceOffer',
		name: 'ReferenceOffer',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getOffers',
		},
		required: true,
		default: '',
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
	// Field 'ID Subscirpiotn '
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
		displayName: 'When Should This Termination Be Applied ?',
		name: 'Immediate',
		type: 'options',
		default: false,
		description: 'Usually a termination is applied at the end of the current term but sometimes you need to applied right away and not wait',
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
				name: 'At the End of the Current Term (Default Behaviour)',
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
		displayName: 'When Should This Upgrade Be Applied ?',
		name: 'Immediate',
		type: 'options',
		default: false,
		description: 'Usually an upgrade is applied right away but sometimes you need to wait the end of the current term to applied it',
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
				name: 'At the End of the Current Term (Default Behaviour)',
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
		displayName: 'Should The Minimum Commitment Be Ignored ?',
		name: 'IgnoreEngagement',
		type: 'options',
		default: false,
		description: 'Some subscriptions can NOT be upgraded because of their commitments. Ex : a monthly subscription with 12 months commitment can not upgrade within the first 12 months.',
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
				name: 'No, Do Not Ignore Commitment',
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
		displayName: 'When Should This Upgrade Be Billed ?',
		name: 'BillNow',
		type: 'options',
		default: false,
		description: 'The upgrade can be billed right away OR at the next renewal (ie at the end of the current term.)',
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
				name: 'Right Away',
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
		displayName: 'Feature Name or ReferenceFeature',
		name: 'ReferenceFeature',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getFeatures',
		},
		required: true,
		default: '',
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
		displayName: 'Feature Name or ReferenceFeature',
		name: 'ReferenceFeature',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getOnOffFeatures',
		},
		required: true,
		default: '',
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
		displayName: 'Enabled ?',
		name: 'IsEnabled',
		type: 'boolean',
		default: true,
		description: 'If True, the Feature will be enabled to the Customer',
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
