interface NavAttributes {
	[propName: string]: any;
}
interface NavWrapper {
	attributes: NavAttributes;
	element: string;
}
interface NavBadge {
	text: string;
	variant: string;
}
interface NavLabel {
	class?: string;
	variant: string;
}

export interface NavData {
	name?: string;
	url?: string;
	icon?: string;
	badge?: NavBadge;
	title?: boolean;
	children?: NavData[];
	variant?: string;
	attributes?: NavAttributes;
	divider?: boolean;
	class?: string;
	label?: NavLabel;
	wrapper?: NavWrapper;
}

export const navItems: NavData[] = [
	{
		title: true,
		name: 'Menu'
	},
	{
		name: 'Projects',
		url: 'fakeurl', // fixed menu expansion
		icon: 'icon-drawer',
		children: [
			{
				name: 'All Projects',
				url: '/projects',
				icon: 'icon-folder-alt'
			},
			{
				name: 'Admin Reviews',
				url: '/pending-projects',
				icon: 'icon-anchor'
			},
		]
	},

	{
		name: 'Templates',
		url: '/project-template',
		icon: 'icon-organization',
	},

	{
		name: 'Task Templates',
		url: '/task-template',
		icon: 'icon-list',
	},

	{
		name: 'Ask Us Submissions',
		url: '/contact-forms',
		icon: 'icon-envelope',
	},
	// {
	// 	name: 'Users',
	// 	url: '/users',
	// 	icon: 'icon-people',
	// },
	{
		name: 'Users',
		url: 'fakeurl', // fixed menu expansion
		icon: 'icon-people',
		children: [
			{
				name: 'Clients',
				url: '/client-listing',
				icon: 'fa fa-user-o'
			},
			{
				name: 'Consultants',
				url: '/consultant-listing',
				icon: 'fa fa-user-secret'
			},
			{
				name: 'Contractors',
				url: '/contractor-listing',
				icon: 'fa fa-group'
			},
		]
	},
	{
		name: 'Consultant Hub',
		url: 'fakeurl', // fixed menu expansion
		icon: 'icon-grid',
		children: [
			{
				name: 'Consultant Profiles',
				url: '/consultant-hub',
				icon: 'icon-people'
			},
			{
				name: 'Invitations',
				url: '/consultant-hub/invitation',
				icon: 'icon-envelope'
			},
			{
				name: 'Articles',
				url: '/article',
				icon: 'icon-notebook'
			},
			{
				name: 'Article Topic',
				url: '/topic',
				icon: 'icon-book-open'
			},
		]
	},
	{
		name: 'Landing Page',
		url: 'fakeurl', // fixed menu expansion
		icon: 'icon-home',
		children: [
			{
				name: 'Sliders',
				url: '/home-sliders',
				icon: 'icon-screen-desktop'
			},
			{
				name: 'Our Services',
				url: '/grid-list',
				icon: 'icon-grid',
			},
			{
				name: 'Partners',
				url: '/partners-logo',
				icon: 'icon-people'
			},
			{
				name: 'Our Story',
				url: '/pages/edit/our-story',
				icon: 'icon-layers'
			},
		]
	},
	{
		name: 'Site Settings',
		url: '/site-settings',
		icon: 'icon-settings',
	},
	{
		name: 'Languages',
		url: '/languages',
		icon: 'icon-bubble'
	},
	{
		name: 'Scope Management',
		url: 'fakeurl', // fixed menu expansion
		icon: 'fa fa-tasks',
		children: [
			{
				name: 'Project Scope',
				url: '/project-scopes',
				icon: 'icon-list'
			},
			{
				name: 'Specifications',
				url: '/project-scopes-info-list',
				icon: 'icon-list'
			},
		]
	},

];
