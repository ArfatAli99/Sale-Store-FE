import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() { }
  getMenu(): Array<any> {
    const menu = [
      {
        name: 'Home',
        path: '/users',
      },
      {
        name: 'Edit',
        path: '/pages/edit'
      },
      {
        name: 'Users',
        path: '/users'
      },
      {
        name: 'Edit',
        path: 'users/edit'
      },
      {
        name: 'Client Listing',
        path: 'client-listing'
      },
      {
        name: 'Consultant Listing',
        path: 'consultant-listing'
      },
      {
        name: 'Contactor Listing',
        path: 'contractor-listing'
      },
      {
        name: 'Consultant Hub',
        path: '/consultant-hub'
      },
      {
        name: 'Add',
        path: '/consultant-hub/add'
      },
      {
        name: 'Edit',
        path: '/consultant-hub/edit'
      },
      {
        name: 'Template',
        path: '/project-template-view'
      },
      {
        name: 'Edit Our Story',
        path: '/our-story'
      },
      {
        name: 'Partners Logo',
        path: '/partners-logo'
      },
      {
        name: 'Add Partner Logo',
        path: '/partners-logo/add'
      },
      {
        name: 'Edit Partner Logo',
        path: '/partners-logo/edit'
      },
      {
        name: 'Site Settings',
        path: '/site-settings'
      },
      {
        name: 'Ask Us Submissions',
        path: '/contact-forms'
      },
      {
        name: 'Articles Listing',
        path: '/article'
      },
      {
        name: 'Add',
        path: '/article/add'
      },
      {
        name: 'Edit',
        path: '/article/edit'
      },
      {
        name: 'Articles Topic Listing',
        path: '/topic'
      },
      {
        name: 'Add',
        path: '/topic/add'
      },
      {
        name: 'Edit',
        path: '/topic/edit'
      },
      {
        name: 'Language Strings',
        path: '/languages'
      },
      {
        name: 'Add String',
        path: '/languages/add'
      },
      {
        name: 'Edit String',
        path: '/languages/edit'
      },
      {
        name: 'Project Scopes',
        path: '/project-scopes'
      },
      {
        name: 'Add Project Scope',
        path: '/project-scopes/add'
      },
      {
        name: 'Edit Project Scope',
        path: '/project-scopes/edit'
      },
      {
        name: 'Projects',
        path: '/projects'
      },
      {
        name: 'Pending Projects',
        path: '/pending-projects'
      },
      {
        name: 'Manage Project',
        path: '/projects/edit'
      },
      {
        name: 'CMS Grid',
        path: '/grid-list'
      },
      {
        name: 'Edit CMS Grid',
        path: '/cms-list/edit'
      },
      {
        name: 'Add Project Stage',
        path: '/project-stages/add'
      },
      {
        name: 'Edit Project Stage',
        path: '/project-stages/edit'
      },
      {
        name: 'All Scopes List',
        path: '/project-scopes-info-list'
      },
      {
        name: 'Add Scope Details',
        path: '/project-scopes-info-list/add'
      },
      {
        name: 'Edit Scope Details',
        path: '/project-scopes-info-list/edit'
      },
      {
        name: 'Project Templates',
        path: '/project-template'
      },
      {
        name: 'Consultant Invitations',
        path: '/consultant-hub/invitation'
      },
      {
        name: 'Update Project Scopes',
        path: '/projects/update-custom-scopes'
      },      
      {
        name: 'User Projects',
        path: '/user-projects'
      },      
    ];

    return menu;
  }
}
