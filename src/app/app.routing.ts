import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Import Containers
import { DefaultLayoutComponent } from './containers';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { ResetpasswordComponent } from './views/resetpassword/resetpassword.component';
import { AuthGuard } from './auth.guard';
import { GridListComponent } from './views/cms-grid/grid-list/grid-list.component';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'projects',
		pathMatch: 'full',
	},

	{
		path: '404',
		component: P404Component,
		data: {
			title: 'Page 404'
		}
	},
	{
		path: '500',
		component: P500Component,
		data: {
			title: 'Page 500'
		}
	},
	{
		path: 'login',
		component: LoginComponent,
		data: {
			title: 'Login Page'
		},
		// canActivate: [AuthGuard]
	},
	{
		path: 'forgot-password',
		component: ForgotPasswordComponent,
		data: {
			title: 'Forgot Password Page'
		}
	},
	{
		path: 'reset-password/:token',
		component: ResetpasswordComponent,
		data: {
			title: 'Reset Password'
		}
	},

	{
		path: '',
		component: DefaultLayoutComponent,
		data: {
			title: 'Home'
		},
		children: [
			// {
			// 	path: 'pages',
			// 	loadChildren: './views/pages/pages-listing/pages-listing.module#PagesListingModule',
			// 	data: {
			// 		breadcrumbs: true,
			// 		text: 'Pages'
			// 	},
			// 	// redirectTo: 'pages/edit/our-story',
			// },
			// {
			// 	path: 'pages/create',
			// 	loadChildren: './views/pages/add-edit-page/add-edit-page.module#AddEditPageModule',
			// 	data: {
			// 		breadcrumbs: true,
			// 		text: 'Add Page'
			// 	},
			// },
			{
				path: 'pages/edit/:slug',
				loadChildren: './views/pages/add-edit-page/add-edit-page.module#AddEditPageModule',
				data: {
					breadcrumbs: true,
					text: 'Edit Page'
				},
			},
			{
				path: 'partners-logo',
				loadChildren: './views/partners/partners-logo-listing/partners-logo-listing.module#PartnersLogoListingModule',
				data: {
					breadcrumbs: true,
					text: 'Partners Logo'
				},
			},
			{
				path: 'partners-logo/add',
				loadChildren: './views/partners/add-edit-partner-logo/add-edit-partner-logo.module#AddEditPartnerLogoModule',
				data: {
					breadcrumbs: true,
					text: 'Add Partner Logo'
				},
			},
			{
				path: 'partners-logo/edit/:id',
				loadChildren: './views/partners/add-edit-partner-logo/add-edit-partner-logo.module#AddEditPartnerLogoModule',
				data: {
					breadcrumbs: true,
					text: 'Edit Partner Logo'
				},
			},
			{
				path: 'home-sliders',
				loadChildren: './views/home-slider/home-slider-listing/home-slider-listing.module#HomeSliderListingModule',
				data: {
					breadcrumbs: true,
					text: 'Home Sliders'
				},
			},
			{
				path: 'home-sliders/add',
				loadChildren: './views/home-slider/add-edit-slider/add-edit-slider.module#AddEditSliderModule',
				data: {
					breadcrumbs: true,
					text: 'Add Slide'
				},
			},
			{
				path: 'home-sliders/edit/:id',
				loadChildren: './views/home-slider/add-edit-slider/add-edit-slider.module#AddEditSliderModule',
				data: {
					breadcrumbs: true,
					text: 'Edit Slide'
				},
			},
			{
				path: 'contact-forms',
				loadChildren: './views/contact-form/contact-form-submission-listing/contact-form-submission-listing.module#ContactFormSubmissionListingModule',
				data: {
					breadcrumbs: true,
					text: 'Contact Form Submissions'
				},
			},
			{
				path: 'contact-forms/edit/:id',
				loadChildren: './views/contact-form/contact-form-submission-details/contact-form-submission-details.module#ContactFormSubmissionDetailsModule',
				data: {
					breadcrumbs: true,
					text: 'Contact Form Submission Details'
				},
			},

			/**added on 21-02-2020 */
			{
				path: 'grid-list',
				loadChildren: './views/cms-grid/grid-list/grid-list.module#GridListModule',
				data: {
					breadcrumbs: true,
					text: 'Grid list'
				},
			},
			{
				path: 'cms-list/add',
				loadChildren: './views/cms-grid/add-page/add-page.module#AddPageModule',
				data: {
					breadcrumbs: true,
					text: 'Add page'
				},
			},
			{
				path: 'cms-list/edit/:id',
				loadChildren: './views/cms-grid/add-page/add-page.module#AddPageModule',
			},
			{
				path: 'users',
				loadChildren: './views/users/users-listing/users-listing.module#UsersListingModule',
			},
			{
				path: 'users/edit/:id',
				loadChildren: './views/users/user-details/user-details.module#UserDetailsModule',
			},
			{
				path: 'users/profile-changes/:id',
				loadChildren: './views/users/user-details/profile-changes/profile-changes.module#ProfileChangesModule',
			},
			{
				path: 'client-listing',
				loadChildren: './views/users/listing/client-listing/client-listing.module#ClientListingModule',
			},
			{
				path: 'consultant-listing',
				loadChildren: './views/users/listing/consultant-listing/consultant-listing.module#ConsultantListingModule',
			},
			{
				path: 'contractor-listing',
				loadChildren: './views/users/listing/contractor-listing/contractor-listing.module#ContractorListingModule',
			},
			{
				path: 'user-projects/:id',
				loadChildren: './views/users/user-projects/user-projects.module#UserProjectsModule',
			},
			{
				path: 'article',
				loadChildren: './views/articles/article-listing/article-listing.module#ArticleListingModule',
			},
			{
				path: 'article/add/',
				loadChildren: './views/articles/article-add-edit/article-add-edit.module#ArticleAddEditModule',
			},
			{
				path: 'article/edit/:id',
				loadChildren: './views/articles/article-add-edit/article-add-edit.module#ArticleAddEditModule',
			},
			// {
			// 	path: 'articles/edit/:id',
			// 	loadChildren: './views/articles/article-details/article-details.module#ArticleDetailsModule',

			// },
			{
				path: 'site-settings',
				loadChildren: './views/site-settings/site-settings-detail/site-settings-detail.module#SiteSettingsDetailModule',
				data: {
					breadcrumbs: true,
					text: 'Site Settings'
				},
			},
			{
				path: 'consultant-hub',
				loadChildren: './views/consultant-hub/consultant-hub-list/consultant-hub-list.module#ConsultantHubListModule',
			},
			{
				path: 'project-template',
				loadChildren: './views/template/template.module#TemplateModule',
			},
			{
				path: 'project-template/details/:id',
				loadChildren: './views/template/template-details/template-details.module#TemplateDetailsModule',
				data: {
					breadcrumbs: true,
					text: 'Contact Form Submission Details'
				},
			},
			{

				path: 'task-template',
				loadChildren: './views/template/task-template/task-template.module#TaskTemplateModule',
			},
			{
				path: 'task-project-template/details/:id',
				loadChildren: './views/template/task-template/task-template-details/task-template-details.module#TaskTemplateDetailsModule',

			},
			// {
			// 	path: 'consultant-hub/edit/:id',
			// 	loadChildren: './views/consultant-hub/consultant-hub-details/consultant-hub-details.module#ConsultantHubDetailsModule',
			// },
			{
				path: 'consultant-hub/edit/:id',
				loadChildren: './views/consultant-hub/add-edit-consultant-profile/add-edit-consultant-profile.module#AddEditConsultantProfileModule',
			},
			{
				path: 'consultant-hub/add',
				loadChildren: './views/consultant-hub/add-edit-consultant-profile/add-edit-consultant-profile.module#AddEditConsultantProfileModule',
			},

			{
				path: 'consultant-hub/invitation',
				loadChildren: './views/consultant-hub/consultant-invitation/consultant-invitation.module#ConsultantInvitationModule',
			},

			{
				path: 'topic',
				loadChildren: './views/articles/article-topic-listing/article-topic-listing.module#ArticleTopicListingModule',
			},
			{
				path: 'topic/add',
				loadChildren: './views/articles/article-topic-add-edit/article-topic-add-edit.module#ArticleTopicAddEditModule',
			},
			{
				path: 'topic/edit/:id',
				loadChildren: './views/articles/article-topic-add-edit/article-topic-add-edit.module#ArticleTopicAddEditModule',
			},
			{
				path: 'languages',
				loadChildren: './views/languages/language-listing/language-listing.module#LanguageListingModule',
				data: {
					breadcrumbs: true,
					text: 'Languages'
				},
			},
			{
				path: 'languages/add',
				loadChildren: './views/languages/add-edit-language/add-edit-language.module#AddEditLanguageModule',
				data: {
					breadcrumbs: true,
					text: 'Add Language'
				},
			},
			{
				path: 'languages/edit/:id',
				loadChildren: './views/languages/add-edit-language/add-edit-language.module#AddEditLanguageModule',
				data: {
					breadcrumbs: true,
					text: 'Edit Language'
				},
			},
			{
				path: 'project-scopes',
				loadChildren: './views/project-scopes/project-scopes-listing/project-scopes-listing.module#ProjectScopesListingModule',
				data: {
					breadcrumbs: true,
					text: 'Project Scopes'
				},
			},
			{
				path: 'project-scopes/add',
				loadChildren: './views/project-scopes/add-edit-project-scope/add-edit-project-scope.module#AddEditProjectScopeModule',
				data: {
					breadcrumbs: true,
					text: 'Add Project Scope'
				},
			},
			{
				path: 'project-scopes/edit/:id',
				loadChildren: './views/project-scopes/add-edit-project-scope/add-edit-project-scope.module#AddEditProjectScopeModule',
				data: {
					breadcrumbs: true,
					text: 'Edit Project Scope'
				},
			},
			{
				path: 'custom-project-scopes/add',
				loadChildren: './views/project-scopes/add-edit-custom-project-scope/add-edit-custom-project-scope.module#AddEditCustomProjectScopeModule',
				data: {
					breadcrumbs: true,
					text: 'Add Custom Project Scope'
				},
			},
			{
				path: 'custom-project-scopes/edit/:id',
				loadChildren: './views/project-scopes/add-edit-custom-project-scope/add-edit-custom-project-scope.module#AddEditCustomProjectScopeModule',
				data: {
					breadcrumbs: true,
					text: 'Edit Custom Project Scope'
				},
			},
			{
				path: 'project-scopes-info-list',
				loadChildren: './views/project-scopes/scope-info/scope-info-list/scope-info-list.module#ScopeInfoListModule',
				data: {
					breadcrumbs: true,
					text: 'Project Scopes Info List'
				},
			},
			{
				path: 'project-scopes-info-list/add',
				loadChildren: './views/project-scopes/scope-info/scope-details/scope-details.module#ScopeDetailsModule',
				data: {
					breadcrumbs: true,
					text: 'Project Scopes Info Add'
				},
			},
			{
				path: 'project-scopes-info-list/edit/:id',
				loadChildren: './views/project-scopes/scope-info/scope-details/scope-details.module#ScopeDetailsModule',
				data: {
					breadcrumbs: true,
					text: 'Project Scopes Info Edit'
				},
			},
			{
				path: 'projects',
				loadChildren: './views/projects/project-listing/project-listing.module#ProjectListingModule',
				data: {
					breadcrumbs: true,
					text: 'Projects'
				},
			},
			{
				path: 'pending-projects',
				loadChildren: './views/projects/pending-projects/pending-projects.module#PendingProjectsModule',
				data: {
					breadcrumbs: true,
					text: 'Pending Projects'
				},
			},
			{
				path: 'projects/edit/:id',
				loadChildren: './views/projects/project-details/project-details.module#ProjectDetailsModule',
				data: {
					breadcrumbs: true,
					text: 'Project Details'
				},
			},
			{
				path: 'project-stages',
				loadChildren: './views/projects/stages/stage-listing/stage-listing.module#StageListingModule',
				data: {
					breadcrumbs: true,
					text: 'Project Stages'
				},
			},
			{
				path: 'project-stages/add/:project_id',
				loadChildren: './views/projects/stages/add-edit-stage/add-edit-stage.module#AddEditStageModule',
				data: {
					breadcrumbs: true,
					text: 'Add Project Stage'
				},
			},
			{
				path: 'project-stages/edit/:project_id/:id',
				loadChildren: './views/projects/stages/add-edit-stage/add-edit-stage.module#AddEditStageModule',
				data: {
					breadcrumbs: true,
					text: 'Edit Project Stage'
				},
			},
			{
				path: 'projects/update-custom-scopes/:id',
				loadChildren: './views/projects/project-details/update-custom-scope/update-custom-scope.module#UpdateCustomScopeModule',
				data: {
					breadcrumbs: true,
					text: 'Edit Project Scopes'
				},
			},
		]
	},
	// { path: '**', component: P404Component }
	{ path: '**', redirectTo: 'projects' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
