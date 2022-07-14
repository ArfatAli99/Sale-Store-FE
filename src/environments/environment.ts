// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// local IP: 192.168.1.191:4055

export const environment = {
	production: false,

	api_url: 'https://staging.uiplonline.com:4056/api/',//'http://dev.uiplonline.com:4028/api/','http://192.168.1.166:4028/api/','http://13.234.109.43:4028/api/'
	base_url: 'https://staging.uiplonline.com/ebinaa-admin/dist/',//'http://staging.uiplonline.com/exp-frontend-build/','http://exp.parts/extreme-performance/',
	upload_url: 'https://staging.uiplonline.com:4056/uploads/',
	editor_upload_url: 'https://staging.uiplonline.com:4056/api/admin/upload-image-our-story',
	socketUrl: 'https://staging.uiplonline.com:4056',
	emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
	phoneNumberPattern: '^[0-9]{8}$',
	phoneNumber: '^(\+\d{1,3}[- ]?)?\d{10}$',
	passwordPattern: /^$|^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[!@#$%^&*]).{8,}$/,
	//   passwordPattern: /^$|^(?=.*?[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
	apiInactiveTimeIntervalMinute: 90,
	accessTokenSetTimeIntervalMinute: 10,
	userListLimit:10,
	consultantHubListLimit:10,
	contactFormListLimit: 10,
	scopesListLimit: 10,
	projectListLimit: 10,
	stagesListLimit: 10,
	partnersLogoListLimit: 10,
	gridItemLimit: 10,
	languageListLimit: 10,
	scopeInfoListLimit: 10,
	// emailPattern = /^[a-zA-Z0-9.]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,20}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,5}[a-zA-Z0-9])?)*$/ig,

	articelListingLimit:10,
	HTTP_STATUS_OK: 200,
	HTTP_STATUS_CREATED: 201,
	HTTP_STATUS_UNAUTHENTICATED: 401,
	HTTP_STATUS_FORBIDDEN: 403,
	HTTP_STATUS_NOT_FOUND: 404,
	HTTP_STATUS_INTERNAL_SERVER_ERROR: 500,
};
