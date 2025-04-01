/* eslint-disable n8n-nodes-base/node-param-description-excess-final-period */
import type {
	IDataObject,
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	JsonObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

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
			// Webhook - checkExists
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					// No webhook id is set so no webhook can exist
					// throw new Error('No webhook id');
					return false;
				}

				// Webhook got created before so check if it still exists
				const endpoint = `/Notification/Webhooks/${webhookData.webhookId}`;
				throw new Error(`endpoint: ${endpoint}`);

				try {
					await apiFetch.call(this, endpoint);
				} catch (error) {
					if (error.httpCode === '404' || error.message.includes('resource_missing')) {
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

				// If it did not error then the webhook exists
				return true;
			},
			// Webhook - create
			async create(this: IHookFunctions): Promise<boolean> {
				const returnData: INodeExecutionData[] = [];
				// const webhookUrl = this.getNodeWebhookUrl('default');
				const credentials = await this.getCredentials('proAbonoApi');

				const tmpWebhookUrl = this.getNodeWebhookUrl('default') ?? '';
				const webhookUrl = tmpWebhookUrl.replace('http://localhost:5678', 'http://88.188.14.161:25208');

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

				const endpoint = '/Notification/Webhooks';

				const body = {
					Url: webhookUrl,
					IdBusiness: credentials.businessId,
					Triggers: events,
				};

				const responseData = await apiSend.call(this, 'POST', endpoint, body);
				returnData.push({ json: responseData });

				if (
					responseData.Id === undefined
				) {
					// Required data is missing so was not successful
					throw new NodeApiError(this.getNode(), responseData as JsonObject, {
						message: 'ProAbono webhook creation response did not contain the expected data.',
					});
				}

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = responseData.Id as string;
				webhookData.isVerified = false;
				webhookData.webhookEvents = responseData.Triggers as string[];
				webhookData.idBusiness = credentials.businessId;
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
			},
			// Webhook - delete
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					const endpoint = `/Notification/Webhooks/${webhookData.webhookId}`;
					const body = {};

					try {
						await apiSend.call(this, 'DELETE', endpoint, body);
					} catch (error) {
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
		},
	};

	// webhook
	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const headerData = this.getHeaderData();
		const webhookData = this.getWorkflowStaticData('node');

    const body = req.body as IDataObject;
		const code = body.Code as string | undefined;

    const webhookResponse: IDataObject = {
      statusCode: 200,
      message: 'Webhook received successfully',
    };

    // Verify webhook signature if provided
    const signature = headerData['x-proabono-signature'] as string;
		const publicKey = headerData['x-proabono-key'] as string;
		const webhookSecurityKey = webhookData.webhookSecurityKey as string;

		// Trust only a valid signature
    if (signature && signature.trim() !== '') {
      const isValid = verifyWebhookSignature(publicKey, signature, webhookSecurityKey);

			// Retr
			if (isValid) {
				// If the Webhook is still not verified
				if (!webhookData.isVerified) {
					// Send the Verification Code
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

					// TODO - Vérifier qu'il y a bien un élément sinon tu retournes un Sample
					// Check Si Count est présent et vaut 1.
					// 			Si Count est présent et vaut 1, on retourne	dummy.Items[0]
					//      sinon check TypeTrigger, retourne un contenu associé
					// toto
					return {
						webhookResponse,
						workflowData: [
							[
								{
									json: dummy.Items[0],
								},
							],
						],
					};
				}
				// Because the webhook is already verified and the notification is valid, the content must be returned to the workflow and starts it.
				else {
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
    }
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


