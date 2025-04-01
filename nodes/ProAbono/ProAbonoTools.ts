import {
  ILoadOptionsFunctions,
	IDataObject,
	IRequestOptions,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHookFunctions,
	IWebhookFunctions,
} from 'n8n-workflow';

/**
 * Make an API Send to ProAbono
 *
 */
export async function apiSend(
	this: IHookFunctions | IWebhookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject,
	query?: IDataObject,
) {
	const options = {
		method,
		body: body,
		qs: query,
		uri: `https://via.proabono.com${endpoint}`,
		json: true,
	} satisfies IRequestOptions;

	if (options.qs && Object.keys(options.qs).length === 0) {
		delete options.qs;
	}

	return await this.helpers.requestWithAuthentication.call(this, 'proAbonoApi', options);
}

/**
 * Make an API Fetch from ProAbono
 *
 */
export async function apiFetch(
	this: IHookFunctions | IWebhookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	endpoint: string,
	query?: IDataObject,
) {
	const options = {
		method: 'GET',
		qs: query,
		uri: `https://via.proabono.com${endpoint}`,
		json: true,
	} satisfies IRequestOptions;

	if (options.qs && Object.keys(options.qs).length === 0) {
		delete options.qs;
	}

	return await this.helpers.requestWithAuthentication.call(this, 'proAbonoApi', options);
}




