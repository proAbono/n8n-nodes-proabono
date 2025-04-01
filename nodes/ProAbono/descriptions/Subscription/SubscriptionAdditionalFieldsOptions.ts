import type { INodeProperties } from 'n8n-workflow';

export const subscriptionAdditionalFieldsOptions: INodeProperties[] = [

	{
		displayName: 'Date Start',
		name: 'DateStart',
		description: 'Set the Date when the Subscription will start. If not provided, the Subscription starts immediately.',
		type: 'dateTime',
		default: '',
	},
	{
		displayName: 'Title',
		name: 'TitleLocalized',
		description: 'Override the Title of the Offer. By Default, the Title of the new Subscription is copied from the Offer.',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Description',
		name: 'DescriptionLocalized',
		description: 'Override the Description of the Offer. By Default, the Description of the new Subscription is copied from the Offer.',
		type: 'string',
		default: '',
	},
	{
		displayName: 'UpFront Fee',
		name: 'AmountUpFront',
		description: 'Override the UpFront Fee (aka Setup Fee) of the Offer. Amount must in cents (127.97 € -> 12797).',
		type: 'number',
		default: '',
	},
	{
		displayName: 'Recurring Amount',
		name: 'AmountRecurrence',
		description: 'Override the Recurring Amount of the Offer. Amount is in cents (592.97 € -> 59297).',
		type: 'number',
		default: '',
	},
	{
		displayName: 'Termination Fee',
		name: 'AmountTermination',
		description: 'Override the Termination fee of the Offer. Amount is in cents (90.00 € -> 9000).',
		type: 'number',
		default: '',
	}
];
