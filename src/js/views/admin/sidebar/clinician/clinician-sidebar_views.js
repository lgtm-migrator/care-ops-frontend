import hbs from 'handlebars-inline-precompile';
import { View } from 'marionette';

import { RoleComponent } from 'js/views/admin/shared/clinicians_components';

import 'sass/modules/buttons.scss';
import 'sass/modules/forms.scss';
import 'sass/modules/sidebar.scss';

import ClinicianSidebarTemplate from './clinician-sidebar.hbs';

const NameView = View.extend({
  className: 'pos--relative',
  template: hbs`<input class="input-primary w-100 js-input" placeholder="{{ @intl.admin.sidebar.clinician.clinicianSidebarViews.nameView.placeholder }}" value="{{ name }}" />`,
  ui: {
    input: '.js-input',
  },
  events: {
    'input @ui.input': 'onInput',
  },
  onInput(evt) {
    this.model.set('name', evt.target.value);
  },
  onDomRefresh() {
    if (this.model.isNew()) {
      this.ui.input.focus();
    }
  },
});

const EmailView = View.extend({
  className: 'pos--relative',
  template: hbs`<input class="input-primary w-100 js-input" placeholder="{{ @intl.admin.sidebar.clinician.clinicianSidebarViews.emailView.placeholder }}" value="{{ email }}" />`,
  ui: {
    input: '.js-input',
  },
  events: {
    'input @ui.input': 'onInput',
  },
  onInput(evt) {
    this.model.set('email', evt.target.value);
  },
});

const SaveView = View.extend({
  className: 'u-margin--t-8 u-text-align--right',
  template: hbs`
    <button class="button--text u-margin--r-4 js-cancel">{{ @intl.admin.sidebar.clinician.clinicianSidebarViews.saveView.cancelBtn }}</button>
    <button class="button--green js-save">{{ @intl.admin.sidebar.clinician.clinicianSidebarViews.saveView.saveBtn }}</button>
  `,
  triggers: {
    'click .js-cancel': 'cancel',
    'click .js-save': 'save',
  },
});

const DisabledSaveView = View.extend({
  className: 'u-margin--t-8 u-text-align--right',
  template: hbs`<button class="button--green" disabled>{{ @intl.admin.sidebar.clinician.clinicianSidebarViews.disabledSaveView.saveBtn }}</button>`,
});

const SidebarView = View.extend({
  className: 'sidebar flex-region',
  template: ClinicianSidebarTemplate,
  triggers: {
    'click .js-close': 'close',
    // 'click .js-menu': 'click:menu',
  },
  childViewTriggers: {
    'save': 'save',
    'cancel': 'cancel',
  },
  regions: {
    name: '[data-name-region]',
    email: '[data-email-region]',
    save: '[data-save-region]',
    role: '[data-role-region]',
    // access: '[data-access-region]',
    // groups: '[data-groups-region]',
  },
  onRender() {
    this.showForm();
    this.showRole();
  },
  showName() {
    this.showChildView('name', new NameView({ model: this.model }));
  },
  showEmail() {
    this.showChildView('email', new EmailView({ model: this.model }));
  },
  showRole() {
    const isDisabled = this.model.isNew();
    const roleComponent = new RoleComponent({ model: this.model, state: { isDisabled } });

    this.listenTo(roleComponent, 'change:role', role => {
      this.model.saveRole(role);
    });

    this.showChildView('role', roleComponent);
  },
  showSave() {
    if (!this.model.isValid()) {
      this.showDisabledSave();
      return;
    }

    this.showChildView('save', new SaveView({ model: this.model }));
  },
  showDisabledSave() {
    this.showChildView('save', new DisabledSaveView());
  },
  showForm() {
    if (this.model.isNew()) {
      this.listenTo(this.model, 'change:name change:email', this.showSave);
      this.showDisabledSave();
    }

    this.showName();
    this.showEmail();
  },
  onSave() {
    this.getRegion('save').empty();
  },
  onCancel() {
    this.triggerMethod('close', this);
  },
});

export {
  SidebarView,
};
