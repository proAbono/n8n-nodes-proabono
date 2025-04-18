import type { IDataObject, INodeProperties } from 'n8n-workflow';

// import { invoiceAdditionalFieldsOptions } from './InvoiceAdditionalFieldsOptions';
import { extractBody, } from '../../ProAbonoApi';

export const invoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'retrieveFullInvoicePDF',
		options: [
			// Retrieve Full Invoice (PDF)
			{
				name: 'Retrieve Full Invoice (PDF)',
				value: 'retrieveFullInvoicePDF',
				description: 'Retrieves an invoice with all details + URL PDF file',
				action: 'Retrieve full invoice pdf',
				routing: {
					request: {
						method: 'GET',
						url: '=/Invoice?FullNumber={{$parameter["FullNumber"]}}',
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
			// Retrieve Full Credit Note (PDF)
			{
				name: 'Retrieve Full Credit Note (PDF)',
				value: 'retrieveFullCreditNotePDF',
				description: 'Retrieves a credit note with all details + URL PDF file',
				action: 'Retrieve full credit note pdf',
				routing: {
					request: {
						method: 'GET',
						url: '=/Invoice?FullNumber={{$parameter["FullNumber"]}}',
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
			// Create a Line in the Balance of the Customer
			{
				name: 'Create a Line in the Customer Balance',
				value: 'createBalanceLine',
				description: 'Creates a new line in the Customer Balance',
				action: 'Create a line in the balance of a customer',
				routing: {
					request: {
						method: 'POST',
						url: '/BalanceLine',
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
			// Bill a Customer
			{
				name: 'Bill a Customer',
				value: 'billCustomer',
				description: 'Creates an invoice with the lines available in the customer balance',
				action: 'Bill a customer',
				routing: {
					request: {
						method: 'POST',
						url: '/Billing/Customer',
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
				resource: ['invoice'],
			},
		},
	},
];

export const invoiceFields: INodeProperties[] = [
	// Field 'Fullnumber' (Invoice)
	{
		displayName: 'Invoice Full Number',
		name: 'FullNumber',
		type: 'string',
		required: true,
		default: '',
		description: 'The number of an invoice looks like "F001-000000023". This is not an ID.',
		displayOptions: {
			show: {
				resource: ['invoice',],
				operation: [
					'retrieveFullInvoicePDF',
				],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'FullNumber',
			},
		},
	},
	// Field 'Fullnumber' (Credit Note)
	{
		displayName: 'Credit Note Full Number',
		name: 'FullNumber',
		type: 'string',
		required: true,
		default: '',
		description: 'The number of an credit note looks like "FA001-000000023". This is not an ID.',
		displayOptions: {
			show: {
				resource: ['invoice',],
				operation: [
					'retrieveFullCreditNotePDF',
				],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'FullNumber',
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
				resource: ['invoice',],
				operation: [
					'createBalanceLine',
					'billCustomer',
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
	// Field 'Label'
	{
		displayName: 'Label',
		name: 'Label',
		type: 'string',
		required: true,
		default: '',
		description: 'Label of the Line which will be displayed in the invoice',
		displayOptions: {
			show: {
				resource: ['invoice',],
				operation: [
					'createBalanceLine',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'Label',
			},
		},
	},
	// Field 'Amount'
	{
		displayName: 'Amount',
		name: 'Amount',
		type: 'number',
		required: true,
		default: '',
		description: 'The Amount must be in cents (127.97 € -> 12797) and before taxes',
		displayOptions: {
			show: {
				resource: ['invoice',],
				operation: [
					'createBalanceLine',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'Amount',
			},
		},
	},
	// Field 'Quantity'
	{
		displayName: 'Quantity',
		name: 'Quantity',
		type: 'number',
		default: 1,
		description: 'Quantity is purely informative and will be displayed in the invoice',
		displayOptions: {
			show: {
				resource: ['invoice',],
				operation: [
					'createBalanceLine',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'Quantity',
			},
		},
	},
	// Field 'EnsureBillable' (Create a Balance Line)
	{
		displayName: 'Only if Customer Has Valid Payment Information?',
		name: 'EnsureBillable',
		type: 'options',
		default: false,
		// description: 'Whether the balance line should be created only if the customer has valid payment information. If not, the operation will be blocked.',
		displayOptions: {
			show: {
				resource: ['invoice',],
				operation: [
					'createBalanceLine',
				],
			},
		},
		options: [
			{
				name: 'Yes, Create the Line only if the Customer Has Valid Payment Information',
				value: true,
			},
			{
				name: 'No, Create the Line in Any Case',
				value: false,
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'EnsureBillable',
			},
		},
	},
	// Field 'NoteLocalized'
	{
		displayName: 'Note',
		name: 'NoteLocalized',
		type: 'string',
		default: '',
		placeholder: 'Purchase Order: 123456',
		description: 'A note is added to the bottom of an invoice PDF, just above the Customer Service Section',
		displayOptions: {
			show: {
				resource: ['invoice',],
				operation: [
					'billCustomer',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'NoteLocalized',
			},
		},
	},
	// Field 'EnsureBillable' (billCustomer)
	{
		displayName: 'Only if Customer Has Valid Payment Information?',
		name: 'EnsureBillable',
		type: 'options',
		default: false,
		// description : 'Whether to force a check for valid payment information before billing. If not enabled, the customer will be billed regardless.',
		displayOptions: {
			show: {
				resource: ['invoice',],
				operation: [
					'billCustomer',
				],
			},
		},
		options: [
			{
				name: 'Yes, Bill only if the Customer Has Valid Payment Information',
				value: true,
			},
			{
				name: 'No, Bill the Customer in Any Case',
				value: false,
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'EnsureBillable',
			},
		},
	},
	// Field 'ForceOffline' (billCustomer)
	{
		displayName: 'Force Offline?',
		name: 'ForceOffline',
		type: 'boolean',
		default: false,
		description: 'Whether to force the invoice to be offline for a customer with automated payment (e.g., card, direct debit)',
		displayOptions: {
			show: {
				resource: ['invoice',],
				operation: [
					'billCustomer',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'ForceOffline',
			},
		},
	},
	// Field 'DateStart' (billCustomer)
	{
		displayName: 'Start Date (Include Lines After)',
		name: 'DateStart',
		type: 'dateTime',
		default: false,
		description: 'Only include balance lines dated on or after this date. Lines before this date will be ignored.',
		displayOptions: {
			show: {
				resource: ['invoice',],
				operation: [
					'billCustomer',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'DateStart',
			},
		},
	},
	// Field 'DateEnd' (billCustomer)
	{
		displayName: 'End Date (Include Lines Before)',
		name: 'DateEnd',
		type: 'dateTime',
		default: false,
		description: 'Only include balance lines dated on or before this date. Lines after this date will be ignored.',
		displayOptions: {
			show: {
				resource: ['invoice',],
				operation: [
					'billCustomer',
				],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'DateEnd',
			},
		},
	},
];
