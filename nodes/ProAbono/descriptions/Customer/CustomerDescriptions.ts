import type { IDataObject, INodeProperties } from 'n8n-workflow';

// import { customerAdditionalFieldsOptions } from './CustomerAdditionalFieldsOptions';
import { extractBody, } from '../../ProAbonoApi';

export const customerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'createUpdateCustomer',
		options: [
			// Create or Update a Customer
			{
				name: 'Create or Update a Customer',
				value: 'createUpdateCustomer',
				description: 'Creates a new customer or Updates a customer if the customer already exists',
				action: 'Create or update a customer',
				routing: {
					request: {
						method: 'POST',
						url: '/Customer',
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
      // Retrieve a Customer
			{
				name: 'Retrieve a Customer',
				value: 'retrieveCustomer',
				description: 'Retrieves an existing customer',
				action: 'Retrieve a customer',
				routing: {
					request: {
						method: 'GET',
						url: '=/customer?ReferenceCustomer={{$parameter["ReferenceCustomer"]}}',
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
      // Retrieve Billing Address of a Customer
			{
				name: 'Retrieve Billing Address of a Customer',
				value: 'retrieveBillingAddress',
				description: 'Retrieves the full billing address of an existing customer',
				action: 'Retrieve billing address of a customer',
				routing: {
					request: {
						method: 'GET',
						url: '=/CustomerBillingAddress?ReferenceCustomer={{$parameter["ReferenceCustomer"]}}',
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
      // Update Billing Address of a Customer
			{
				name: 'Update Billing Address of a Customer',
				value: 'updateBillingAddress',
				description: 'Updates the full billing address of an existing customer',
				action: 'Update billing address of a customer',
				routing: {
					request: {
						method: 'POST',
						url: '/CustomerBillingAddress',
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
      // Retrieve Payment Settings of a Customer
			{
				name: 'Retrieve Payment Settings of a Customer',
				value: 'retrievePaymentSettings',
				description: 'Retrieves the payment settings of an existing customer',
				action: 'Retrieve payment settings of a customer',
				routing: {
					request: {
						method: 'GET',
						url: '=/CustomerSettingsPayment?ReferenceCustomer={{$parameter["ReferenceCustomer"]}}',
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
      // Update Billing Address of a Customer
			{
				name: 'Update Payment Settings of a Customer',
				value: 'updatePaymentSettings',
				description: 'Updates the payment settings of an existing customer',
				action: 'Update payment settings of a customer',
				routing: {
					request: {
						method: 'POST',
						url: '/CustomerSettingsPayment',
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
      // Anonymize a Customer
			{
				name: 'Anonymize a Customer',
				value: 'anonymizeCustomer',
				description: 'Anonymizes a Customer. It will erase all personal data of a Customer while keeping its invoices and its subscriptions history. #GDPR #Privacy',
				action: 'Anonymize a customer',
				routing: {
					request: {
						method: 'POST',
						url: '/Customer/Anonymization',
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
		],
		displayOptions: {
			show: {
				resource: ['customer'],
			},
		},
	},
];
// Customer Fields
export const customerFields: INodeProperties[] = [
	// Field 'Name'
	{
		displayName: 'Name',
		name: 'Name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'John Doe',
		description: 'Name of the customer',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: ['createUpdateCustomer',],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'Name',
			},
		},
	},
	// Field 'Email'
	{
		displayName: 'Email',
		name: 'Email',
		type: 'string',
		default: '',
		placeholder: 'john@doe.com',
		description: 'Email address of the customer',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: ['createUpdateCustomer',],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'Email',
				value: '={{$value.toLowerCase()}}',
			},
		},
	},
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
				resource: ['customer',],
				operation: [
					'createUpdateCustomer',
					'retrieveCustomer',
					'retrieveBillingAddress',
					'updateBillingAddress',
					'retrievePaymentSettings',
					'updatePaymentSettings',
					'anonymizeCustomer',
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
	// Field 'Language'
	{
		displayName: 'Language',
		name: 'Language',
		type: 'string',
		default: '',
		placeholder: 'fr',
		description: 'Language of your customer. See all Language Codes at https://docs.proabono.com/api/#languages.',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: ['createUpdateCustomer',],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'Language',
			},
		},
	},
	// Field 'Reference Affiliation'
	{
		displayName: 'Reference Affiliation',
		name: 'ReferenceAffiliation',
		type: 'string',
		default: '',
		description: 'This field helps you to add information of affiliation to the Customer. For example, you can add an ip address, a name of a reseller, etc.',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: ['createUpdateCustomer',],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'ReferenceAffiliation',
			},
		},
	},
	// Field 'Segment'
	{
		displayName: 'Segment Name or ID',
		name: 'IdSegment',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getSegments',
		},
		required: true,
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: ['createUpdateCustomer',],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'IdSegment',
			},
		},
	},
	// Field 'Company'
	{
		displayName: 'Company',
		name: 'Company',
		type: 'string',
		default: '',
		placeholder: 'John Doe LLC',
		description: 'Company name',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updateBillingAddress',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'Company',
			},
		},
	},
	// Field 'First Name'
	{
		displayName: 'First Name',
		name: 'FirstName',
		type: 'string',
		default: '',
		placeholder: 'John',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updateBillingAddress',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'FirstName',
			},
		},
	},
	// Field 'Last Name'
	{
		displayName: 'Last Name',
		name: 'LastName',
		type: 'string',
		default: '',
		placeholder: 'Doe',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updateBillingAddress',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'LastName',
			},
		},
	},
	// Field 'Address Line 1'
	{
		displayName: 'Address Line 1',
		name: 'AddressLine1',
		type: 'string',
		default: '',
		placeholder: '123 avenue des Champs Elysées',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updateBillingAddress',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'AddressLine1',
			},
		},
	},
	// Field 'Address Line 2'
	{
		displayName: 'Address Line 2',
		name: 'AddressLine2',
		type: 'string',
		default: '',
		placeholder: '1st Floor',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updateBillingAddress',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'AddressLine2',
			},
		},
	},
	// Field 'City'
	{
		displayName: 'City',
		name: 'City',
		type: 'string',
		default: '',
		placeholder: 'Paris',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updateBillingAddress',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'City',
			},
		},
	},
	// Field 'ZIP Code'
	{
		displayName: 'ZIP Code',
		name: 'ZipCode',
		type: 'string',
		default: '',
		placeholder: '75008',
		description: 'ZIP/Postal code',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updateBillingAddress',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'ZipCode',
			},
		},
	},
	// Field 'Country'
	{
		displayName: 'Country',
		name: 'Country',
		type: 'string',
		default: '',
		placeholder: 'FR',
		description: 'Country Code [ISO 3166-1 Alpha-2 code](http://en.wikipedia.org/wiki/ISO_3166-1#Current_codes) (ie Country Code in 2 letters)',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updateBillingAddress',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'Country',
			},
		},
	},
	// Field 'Region/State/Province'
	{
		displayName: 'Region/State/Province',
		name: 'Region',
		type: 'string',
		default: '',
		placeholder: 'FR-75',
		description: 'Region/State/Province Code [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2). (e.g., FR-75, US-DE).',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updateBillingAddress',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'Region',
			},
		},
	},
	// Field 'Tax Information'
	{
		displayName: 'Tax Information',
		name: 'TaxInformation',
		type: 'string',
		default: '',
		placeholder: 'FR1234567890',
		description: 'I.e. VAT number (english), numéro de TVA Intracommunautaire, (français), etc.',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updateBillingAddress',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'TaxInformation',
			},
		},
	},
	// Field 'Phone'
	{
		displayName: 'Phone',
		name: 'Phone',
		type: 'string',
		default: '',
		placeholder: '+33102030405',
		description: 'Phone number',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updateBillingAddress',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'Phone',
			},
		},
	},
	// Field 'Type Payment'
	{
		displayName: 'Type Payment1',
		name: 'TypePayment',
		type: 'options',
		default: 'ExternalBank',
		description: 'Choose from the list, or specify a TypePayment using an <a href="https://docs.proabono.com/api/#type-payment">expression</a>',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updatePaymentSettings',
				],
			},
		},
		options: [
			{
				name: 'Wire/Bank Transfer',
				value:'ExternalBank',
			},
			{
				name: 'Check',
				value:'ExternalCheck',
			},
			{
				name: 'Cash',
				value:'ExternalCash',
			},
			{
				name: 'Other',
				value:'ExternalOther',
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'TypePayment',
			},
		},
	},
	// Field 'Date Next Billing'
	{
		displayName: 'Date Next Billing',
		name: 'DateNextBilling',
		type: 'dateTime',
		default: null,
		description: 'Date of next billing',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updatePaymentSettings',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'DateNextBilling',
			},
		},
	},
	// Field 'Is Auto Billing'
	{
		displayName: 'Is Auto Billing',
		name: 'IsAutoBilling',
		type: 'boolean',
		default: false,
		description: 'Whether auto billing is enabled',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updatePaymentSettings',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'IsAutoBilling',
			},
		},
	},
	// Field 'Is Grey Listed'
	{
		displayName: 'Is Grey Listed',
		name: 'IsGreyListed',
		type: 'boolean',
		default: false,
		description: 'Whether the customer is grey listed',
		displayOptions: {
			show: {
				resource: ['customer',],
				operation: [
					'updatePaymentSettings',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'IsGreyListed',
			},
		},
	},
];

