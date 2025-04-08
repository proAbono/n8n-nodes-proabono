# n8n-node-proabono

This is an n8n community node. It lets you use [ProAbono](https://www.proabono.com/) in your n8n workflows.

ProAbono is a subscription billing platform that helps SaaS businesses manage their subscriptions, automate their billing, and streamline payment collection.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `@proabono/n8n-nodes-proabono` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes: select **I understand the risks of installing unverified code from a public source**.
5. Select **Install**.

After installing the node, you can use it like any other node. n8n displays the node in search results in the **Nodes** panel.

## Operations

This node supports the following operations:

### Customer Actions
- Create or update a customer
- Retrieve a customer
- Retrieve billing address of a customer
- Update billing address of a customer
- Retrieve payment settings of a customer
- Update payment settings of a customer
- Anonymize a customer

### Subscription Actions
- Create a subscription
- Retrieve a subscription
- Start a subscription or restart a subscription
- Upgrade a subscription
- Suspend a subscription
- Terminate a subscription
- Add usage quantity
- Enable / disable a feature

### Invoice Actions
- Retrieve full invoice PDF
- Retrieve full credit note PDF
- Create a line in the balance of the customer
- Bill a customer

### Trigger Events

#### Customer Events
- Customer Added
- Billing Address Updated
- Payment Method Updated
- Billing Succeeded / Failed
- Charging Succeeded / Failed / Pending
- Auto-Charging Failed (No Payment Info / No Retry)
- Customer Suspended / Enabled
- Customer Added to Grey List

#### Subscription Events
- Subscription Started / Renewed / Restarted
- Subscription Suspended (Agent / No Payment / Payment Due)
- Subscription Terminated / Over / Deleted
- Subscription Updated / Features Updated / Terminated for Upgrade / Started as Upgrade
- Term Date Updated

#### Invoice Events
- Invoice Issued (Automatic / Offline)
- Invoice Paid / Refunded / Cancelled
- Invoice Payment Failed / Overdue / Disputed / Uncollectible
- Credit Note Issued
- Payment Authentication Requested

#### Payment Method Events
- Payment Method Expires Soon / Expired
- Defective Payment Method
- Insufficient Funds
- Multiple Payment Issues

## Credentials

To use this node, you will need to create and configure ProAbono credentials in n8n.

1. Go to [ProAbono's n8n integration page](https://via.proabono.com/App/Integration/ThirdParty/n8n).
2. Copy the credentials (Agent Key, API Key, Business ID, and Webhook Security Key).
3. In n8n, go to **Credentials > Create new credentials**, select **ProAbono API**, and enter the required values.

These credentials will be used to authenticate your requests to the ProAbono API.

## Compatibility

Tested with n8n version 1.85.4 and above.

## Usage

Once installed, search for "ProAbono" in your nodes panel. You can connect your ProAbono account via credentials, and start integrating customer, subscription, and invoice operations into your automated workflows.

Need help getting started with n8n? Check out the [Try it out](https://docs.n8n.io/try-it-out/) documentation.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [ProAbono API Reference](https://docs.proabono.com/api/#introduction)

## Version history

### 1.0.0
- Initial release
- Support for customer, subscription, and invoice operations
