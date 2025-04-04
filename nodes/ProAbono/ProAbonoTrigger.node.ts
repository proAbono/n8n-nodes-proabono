/* eslint-disable n8n-nodes-base/node-param-description-excess-final-period */
import type {
	IDataObject,
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	INodeExecutionData,
} from 'n8n-workflow';

// import { JsonObject, NodeApiError } from 'n8n-workflow';

import { apiSend, apiFetch } from './ProAbonoTools';
import { verifyWebhookSignature, } from './ProAbonoApi';

export class ProAbonoTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ProAbono Trigger',
		name: 'proAbonoTrigger',
		icon: 'file:proabono.svg',
		group: ['trigger'],
		version: 1,
		description: 'Handle ProAbono events via webhooks',
		defaults: {
			name: 'ProAbono Trigger',
		},
		inputs: [],
    outputs: ['main'],
		credentials: [
			{
				name: 'proAbonoApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			// 'Customer Events'
			{
				displayName: 'Customer Events',
				name: 'customerEvents',
				type: 'multiOptions',
				default: [],
				description: 'The event to listen to',
				// eslint-disable-next-line n8n-nodes-base/node-param-multi-options-type-unsorted-items
				options: [
					{
						name: 'Customer - Added',
						value: 'CustomerAdded',
						description: 'Occurs whenever a new customer is added to ProAbono.',
					},
					{
						name: 'Customer - Billing Address Updated',
						value: 'CustomerBillingAddressUpdated',
						description: 'Occurs whenever the billing address of a customer is updated.',
					},
					{
						name: 'Customer - Payment Method Updated',
						value: 'CustomerPaymentMethodUpdated',
						description: 'Occurs whenever a payment method of a customer is updated.',
					},
					{
						name: 'Customer - Billing Succeeded',
						value: 'CustomerBillingSucceeded',
						description: 'Occurs whenever billing a customer has succeeded.',
					},
					{
						name: 'Customer - Billing Failed',
						value: 'CustomerBillingFailed',
						description: 'Occurs whenever billing a customer has failed.',
					},
					{
						name: 'Customer - Charging Succeeded',
						value: 'CustomerChargingSucceeded',
						description: 'Occurs whenever charging a customer has succeeded.',
					},
					{
						name: 'Customer - Charge Pending',
						value: 'CustomerChargingPending',
						description: 'Occurs whenever charging a customer is pending.',
					},
					{
						name: 'Customer - Charging Failed',
						value: 'CustomerChargingFailed',
						description: 'Occurs whenever charging a customer has failed.',
					},
					{
						name: 'Customer - Auto-Charging Failed: No Valid Payment Information',
						value: 'CustomerChargingAutoFailedNoPermission',
						description: 'Occurs whenever auto-charging failed due to no valid payment information.',
					},
					{
						name: 'Customer - an Auto-Charging Failed and Cannot Be Retried',
						value: 'CustomerChargingAutoFailedNoRetry',
						description: 'Occurs whenever auto-charging failed and cannot be retried.',
					},
					{
						name: 'Customer - Suspended',
						value: 'CustomerSuspended',
						description: 'Occurs whenever a customer is suspended.',
					},
					{
						name: 'Customer - Enabled',
						value: 'CustomerEnabled',
						description: 'Occurs whenever a customer is enabled.',
					},
					{
						name: 'Customer - Added to Grey List',
						value: 'CustomerIsGreyListed',
						description: 'Occurs whenever a customer is grey listed.',
					}
				],
			},
			// 'Subscription Events'
			{
				displayName: 'Subscription Events',
				name: 'subscriptionEvents',
				type: 'multiOptions',
				default: [],
				description: 'The event to listen to',
				// eslint-disable-next-line n8n-nodes-base/node-param-multi-options-type-unsorted-items
				options: [
					{
						name: 'Subscription - Started',
						value: 'SubscriptionStarted',
						description: 'Occurs whenever a subscription has started.'
					},
					{
						name: 'Subscription - Renewed',
						value: 'SubscriptionRenewed',
						description: 'Occurs whenever a subscription is automatically renewed.'
					},
					{
						name: 'Subscription - Suspended by an Agent',
						value: 'SubscriptionSuspendedAgent',
						description: 'Occurs whenever a subscription is suspended from API or Backoffice.'
					},
					{
						name: 'Subscription - Restarted',
						value: 'SubscriptionRestarted',
						description: 'Occurs whenever a subscription has restarted.'
					},
					{
						name: 'Subscription - Interrupted (No Payment Method)',
						value: 'SubscriptionSuspendedPaymentInfoMissing',
						description: 'Occurs whenever a paying subscription is interrupted during the renewal process because the customer does not have a valid payment method. (no payment method at all or no valid payment method).'
					},
					{
						name: 'Subscription - Interrupted (Payment Due)',
						value: 'SubscriptionSuspendedPaymentDue',
						description: 'Occurs whenever a paying subscription is interrupted during the renewal process due to exceeding one of the thresholds related to unpaid invoices.'
					},
					{
						name: 'Subscription - Terminated at End of the Billing Period',
						value: 'SubscriptionTerminatedAtRenewal',
						description: 'Occurs whenever a cancellation request of a subscription is made.'
					},
					{
						name: 'Subscription - Terminated',
						value: 'SubscriptionTerminated',
						description: 'Occurs whenever a subscription is terminated.'
					},
					{
						name: 'Subscription - Over',
						value: 'SubscriptionHistory',
						description: 'Occurs whenever a subscription is over.'
					},
					{
						name: 'Subscription - Deleted',
						value: 'SubscriptionDeleted',
						description: 'Occurs whenever a subscription is deleted.'
					},
					{
						name: 'Subscription - Updated',
						value: 'SubscriptionUpdated',
						description: 'Occurs whenever a subscription is updated.'
					},
					{
						name: 'Subscription - Features Updated',
						value: 'SubscriptionFeaturesUpdated',
						description: 'Occurs whenever a feature of subscription is updated.'
					},
					{
						name: 'Subscription - Started as Upgrade',
						value: 'SubscriptionUpgraded',
						description: 'Occurs whenever a new subscription is started during an upgrade.'
					},
					{
						name: 'Subscription - Terminated for Upgrade',
						value: 'SubscriptionTerminatedForUpgrade',
						description: 'Occurs whenever a subscription is terminated during an upgrade.'
					},
					{
						name: 'Subscription - Term Date Updated',
						value: 'SubscriptionDateTermUpdated',
						description: 'Occurs whenever the date term of a subscription is updated.'
					}
				],
			},
			// 'Invoice Events'
			{
				displayName: 'Invoice Events',
				name: 'invoiceEvents',
				type: 'multiOptions',
				default: [],
				description: 'The event to listen to',
				// eslint-disable-next-line n8n-nodes-base/node-param-multi-options-type-unsorted-items
				options: [
					{
						name: 'Invoice - Issued, Charging Programmed',
						value: 'InvoiceDebitIssuedPaymentAuto',
						description: 'Occurs whenever an invoice is issued and its payment is automatic (Bank card, Sepa Mandate, ...).'
					},
					{
						name: 'Invoice - Payment Due',
						value: 'InvoiceDebitIssuedPaymentOffline',
						description: 'Occurs whenever an invoice is issued and its payment is offline (Wire transfer, Check, Cash, other).'
					},
					{
						name: 'Invoice - Paid',
						value: 'InvoiceDebitPaid',
						description: 'Occurs whenever an invoice is paid.'
					},
					{
						name: 'Invoice - Refunded',
						value: 'InvoiceDebitRefunded',
						description: 'Occurs whenever an invoice is refunded.'
					},
					{
						name: 'Invoice - Cancelled',
						value: 'InvoiceDebitCancelled',
						description: 'Occurs whenever an invoice is cancelled.'
					},
					{
						name: 'Invoice - Auto Payment Failed',
						value: 'InvoiceDebitPaymentAutoFailed',
						description: 'Occurs whenever an invoice that has just moved to the \"automatic payment failed\" status.'
					},
					{
						name: 'Invoice - Auto Payment Rejected: Payment Authentication Requested',
						value: 'InvoiceDebitPaymentAutoRequestedAuto',
						description: 'Occurs whenever an automated payment of an invoice is rejected and a payment authentication requested.'
					},
					{
						name: 'Invoice - Overdue',
						value: 'InvoiceDebitOverdue',
						description: 'Occurs whenever an invoice is overdue.'
					},
					{
						name: 'Invoice - Disputed',
						value: 'InvoiceDebitDisputed',
						description: 'Occurs whenever an invoice is disputed.'
					},
					{
						name: 'Invoice - Uncollectible',
						value: 'InvoiceDebitUncollectible',
						description: 'Occurs whenever an invoice is marked as uncollectible.'
					},
					{
						name: 'Credit Note - Issued',
						value: 'InvoiceCreditIssued',
						description: 'Occurs whenever a credit note is issued. It occurs when an invoice is cancelled or refunded.'
					}
				]
				,
			},
			// 'Payment Method Events'
			{
				displayName: 'Payment Method Events',
				name: 'paymentEvents',
				type: 'multiOptions',
				default: [],
				description: 'The event to listen to',
				// eslint-disable-next-line n8n-nodes-base/node-param-multi-options-type-unsorted-items
				options: [
					{
						name: 'Payment Information - Expires Soon',
						value: 'GatewayPermissionSoonExpired',
						description: 'Occurs whenever a payment method of a customer expires soon.'
					},
					{
						name: 'Payment Information - Expires',
						value: 'GatewayPermissionExpired',
						description: 'Occurs whenever a payment method of a customer is expired.'
					},
					{
						name: 'Payment Information - Defective',
						value: 'GatewayPermissionDefective',
						description: 'Occurs whenever a payment method is defective.'
					},
					{
						name: 'Payment Information - Insufficient Funds',
						value: 'GatewayPermissionInsufficientFunds',
						description: 'Occurs whenever a debit has failed due to \"Insufficient Funds\".'
					},
					{
						name: 'Payment Information - Payment Issues',
						value: 'GatewayPermissionPaymentIssues',
						description: 'Occurs whenever multiples payment incidents occured with the same payment information of a customer.'
					}
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					// No webhook id is set so no webhook can exist
					return false;
				}

				// Webhook got created before so check if it still exists
				const endpoint = `/Notification/Webhooks/${webhookData.webhookId}`;

				try {
					await apiFetch.call(this, endpoint);
				}
				catch (error) {
					if (error.httpCode === '404') {
						// Webhook does not exist
						delete webhookData.webhookId;
						delete webhookData.webhookEvents;
						delete webhookData.idBusiness;
						delete webhookData.isVerified;
						delete webhookData.webhookSecurityKey;

						return false;
					}
					// Some error occured
					throw error;
				}

				// Webhook got created before so check if it still exists
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const returnData: INodeExecutionData[] = [];

				// Get the public webhook URL
				const webhookUrl = this.getNodeWebhookUrl('default');

				// Credentials are required to create a wbehook via ProAbono's API
				const credentials = await this.getCredentials('proAbonoApi');

				// Get & Merge all events in order to save it for later
				const customerEvents = this.getNodeParameter('customerEvents', []) as IDataObject[];
				const subscriptionEvents = this.getNodeParameter('subscriptionEvents', []) as IDataObject[];
				const invoiceEvents = this.getNodeParameter('invoiceEvents', []) as IDataObject[];
				const paymentEvents = this.getNodeParameter('paymentEvents', []) as IDataObject[];

				const events = [
					...(customerEvents ?? []),
					...(subscriptionEvents ?? []),
					...(invoiceEvents ?? []),
					...(paymentEvents ?? []),
				];

				// Create the webhook on ProAbono via its API
				const endpoint = '/Notification/Webhooks';

				const body = {
					Url: webhookUrl,
					IdBusiness: credentials.businessId,
					Triggers: events,
				};

				const responseData = await apiSend.call(this, 'POST', endpoint, body);
				returnData.push({ json: responseData });

				if (responseData?.Id != null) {
					const webhookData = this.getWorkflowStaticData('node');
					// Save webhookId in order to DELETE properly the webhook later
					webhookData.webhookId = responseData.Id as string;
					// When a webhook is not verify, ProAbono will not send any notification to the URL
					webhookData.isVerified = false;
					// Saving the triggers isn't necessary, but it can be useful later if you want to check the type of trigger received.
					webhookData.webhookEvents = responseData.Triggers as string[];
					webhookData.idBusiness = credentials.businessId;
					// Saving webhookSecurityKey is important to verify the signatre of a received content
					webhookData.webhookSecurityKey = credentials.webhookSecurityKey;

					// Request Verification Code
					apiFetch.call(
						this,
						`/Notification/Webhooks/${webhookData.webhookId}/Verification`,
						{
							sendCode: true,
						}
					);
					return true;
				}
				else {
					// Required data is missing so was not successful
					// throw new NodeApiError(this.getNode(), responseData as JsonObject, {
					// 	message: 'ProAbono webhook creation response did not contain the expected data.',
					// });
					return false;
				}
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {

					const endpoint = `/Notification/Webhooks/${webhookData.webhookId}`;
					const body = {};

					// delete the webhook on ProAbono.
					// it stops sending any notifications.
					try {
						await apiSend.call(this, 'DELETE', endpoint, body);
					}
					catch (error) {
						return false;
					}

					// Remove from the static workflow data so that it is clear
					// that no webhooks are registered anymore
					delete webhookData.webhookId;
					delete webhookData.webhookEvents;
					delete webhookData.isVerified;
					delete webhookData.idBusiness;
					delete webhookData.webhookSecurityKey;
				}
				return true;
			},
		}
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// const bodyData = this.getBodyData();
		const req = this.getRequestObject();
		const headerData = this.getHeaderData();
		const webhookData = this.getWorkflowStaticData('node');
		const body = req.body as IDataObject;

		// prepare the response
		const webhookResponse: IDataObject = {
			statusCode: 200,
			message: 'Webhook received successfully',
		};

		// First, check if the notification comes from ProAbono
		// Verify webhook signature

    const signature = headerData['x-proabono-signature'] as string;
		const publicKey = headerData['x-proabono-key'] as string;
		const webhookSecurityKey = webhookData.webhookSecurityKey as string;

		const isTrustable = verifyWebhookSignature(publicKey, signature, webhookSecurityKey);

		if(isTrustable)
		{
			// if the webhook is not verified (active in ProAbono), send the Verification Code
			if (!webhookData.isVerified) {
				// Send the Verification Code
				const code = body.Code as string | undefined;
				await apiSend.call(
					this,
					'POST',
					`/Notification/Webhooks/${webhookData.webhookId}/Verification?code=${code}&echo=true`,
					{});

				// Now the webhook is verified.
				webhookData.isVerified = true;

				// Retrieve Dummy Data
				const dummy = await apiFetch.call(
					this,
					'/Notification/WebhookNotifications/RewindEvents',
					{
						idBusiness: webhookData.idBusiness,
						sizepage: 1,
						links: false,
						TypeTrigger: webhookData.webhookEvents,
					}
				);

				// Inform the user whenever no event were available.
				const workflowData = (dummy?.Count ?? 0) >= 1
				? [[{ json: dummy.Items[0] }]]
				: [[{ json: { message: 'No available events.' } }]];

				return {
					webhookResponse,
					workflowData,
				};
			}
			// The webhook is already verified, so just need to return the content of the event sent by ProAbono
			else{
				return {
					webhookResponse,
					workflowData: [
						[
							{
								json: body,
							},
						],
					],
				};
			}
		}

		// Just simply say nothing. Maybe it is an attack.
		return {
			webhookResponse,
			workflowData: [
				[
					{
						json: {},
					},
				],
			],
		};
	}
}


