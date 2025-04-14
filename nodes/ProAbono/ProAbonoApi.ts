import {
	IDataObject,
  ILoadOptionsFunctions,
	IWebhookFunctions,
} from 'n8n-workflow';

import { apiFetch } from './ProAbonoTools';
import crypto from 'crypto';

// GetSegments
export async function getSegments(this: ILoadOptionsFunctions) {
  try {
    const credentials = await this.getCredentials('proAbonoApi');
		const body = await apiFetch.call(
			this,
			'/Organization/Segments',
			{
				sizePage: 100,
				IdBusiness: credentials.businessId,
				Links: false,
			},
		);

		if (!body.Items || !Array.isArray(body.Items)) {
      throw new Error('Invalid response format from segments API');
    }

    const options = body.Items.map((item: { Name: string; Id: number }) => ({
      name: item.Name,
      value: item.Id,
    }));

    return options;
  } catch (error) {
    throw error;
  }
}

// GetOffers
export async function getOffers(this: ILoadOptionsFunctions) {
  try {
    const credentials = await this.getCredentials('proAbonoApi');
		const body = await apiFetch.call(
			this,
			'/Sub/Offers',
			{
				sizePage: 100,
				IdBusiness: credentials.businessId,
				Links: false,
			},
		);

    if (!body.Items || !Array.isArray(body.Items)) {
      throw new Error('Invalid response format from segments API');
    }

    const options = body.Items.map((item: { Name: string; ReferenceOffer: string }) => ({
      name: item.Name,
      value: item.ReferenceOffer,
    }));

    return options;
  } catch (error) {
    throw error;
  }
}

// GetFeatures
export async function getFeatures(this: ILoadOptionsFunctions) {
  try {
    const credentials = await this.getCredentials('proAbonoApi');
		const body = await apiFetch.call(
			this,
			'/Organization/Features',
			{
				sizePage: 1000,
				IdBusiness: credentials.businessId,
				WithQuantity: true,
				Links: false,
			},
		);

    if (!body.Items || !Array.isArray(body.Items)) {
      throw new Error('Invalid response format from segments API');
    }

    const options = body.Items.map((item: { Name: string; ReferenceFeature: string }) => ({
      name: item.Name,
      value: item.ReferenceFeature,
    }));

    return options;
  } catch (error) {
    throw error;
  }
}

// GetOnOffFeatures
export async function getOnOffFeatures(this: ILoadOptionsFunctions) {
  try {
    const credentials = await this.getCredentials('proAbonoApi');
		const body = await apiFetch.call(
			this,
			'/Organization/Features',
			{
				sizePage: 1000,
				IdBusiness: credentials.businessId,
				TypeFeature: 'OnOff',
				Links: false,
			},
		);

    if (!body.Items || !Array.isArray(body.Items)) {
      throw new Error('Invalid response format from segments API');
    }

    const options = body.Items.map((item: { Name: string; ReferenceFeature: string }) => ({
      name: item.Name,
      value: item.ReferenceFeature,
    }));

    return options;
  } catch (error) {
    throw error;
  }
}

export function extractBody(response: any) {
	const {
		Links,
		...body
	} = response.body;

	// turn the array of links into an object where rel is the key
	const adjusted = {} as any;
	Links.forEach((link: any) => {
		adjusted[link.rel] = link.href;
	});

body.Links = adjusted;

	return [
		{
			json: body as IDataObject,
		},
	];
}

/**
 * Verifies the webhook signature from ProAbono.
 *
 * @param publicKey - The public key provided in the webhook (`x-proabono-key`)
 * @param signature - The signature to verify (`x-proabono-signature`)
 * @param privateKey - Your private secret key
 * @returns `true` if the signature is valid, otherwise `false`
 */
export function verifyWebhookSignature(
  publicKey: string,
  signature: string,
  privateKey: string
): boolean {

  try {
    const computedHash = crypto
      .createHash('sha256')
      .update(publicKey + privateKey)
      .digest();

    const providedSignatureBuffer = Buffer.from(signature, 'base64');

    // Use timingSafeEqual to avoid timing attacks
    if (
      providedSignatureBuffer.length !== computedHash.length
    ) {
      return false;
    }

    return crypto.timingSafeEqual(computedHash, providedSignatureBuffer);
  } catch (err) {
    // Optionally log the error
    return false;
  }
}

// getSampleEventByTrigger
// 1. Try to get real events from RewindEvents
// 2. Fall back to static sample from /Webhooks/Sample
export async function getSampleEventByTrigger(
	this: IWebhookFunctions,
	typeTrigger: string,
	idBusiness: number,
): Promise<IDataObject> {
	try {
		// 1. Try to get real events from RewindEvents
		const rewindResponse = await apiFetch.call(
			this,
			'/Notification/WebhookNotifications/RewindEvents',
			{
				idBusiness,
				sizepage: 1,
				links: false,
				TypeTrigger: typeTrigger,
			}
		);

		if ((rewindResponse?.Count ?? 0) >= 1) {
			return rewindResponse.Items[0];
		}

		// 2. Fall back to static sample from /Webhooks/Sample
		const sampleResponse = await apiFetch.call(
			this,
			'/Notification/Webhooks/Sample',
			{
				TypeTrigger: typeTrigger,
			}
		);

		const parsedData = typeof sampleResponse?.Data === 'string'
			? JSON.parse(sampleResponse.Data)
			: sampleResponse?.Data;

		return parsedData ?? { message: `No sample available for trigger: ${typeTrigger}` };

	} catch (error) {
		return {
			message: `Error retrieving event for trigger: ${typeTrigger}`,
			error: error instanceof Error ? error.message : error,
		};
	}
}
