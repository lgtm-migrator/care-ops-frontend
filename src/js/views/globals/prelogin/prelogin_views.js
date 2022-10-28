import { range } from 'underscore';
import { View } from 'marionette';

import 'scss/core/_fonts.scss';
import 'scss/modules/buttons.scss';
import 'scss/modules/fill-window.scss';
import 'scss/modules/loader.scss';

import PreloginTemplate from './prelogin.hbs';
import LoginPromptTemplate from './login-prompt.hbs';
import NotSetupTemplate from './not-setup.hbs';

import './prelogin.scss';

const LoginView = View.extend({
  className: 'prelogin__content',
  triggers: {
    'click .js-login': 'click:login',
  },
  template: LoginPromptTemplate,
  templateContext: {
    url: location.host,
  },
});

const LoginPromptView = View.extend({
  el: '#root',
  /* istanbul ignore next: unable to test auth views in cypress */
  onRender() {
    this.$el.addClass('prelogin');
    this.showChildView('content', new LoginView());
  },
  regions: {
    content: {
      el: '[data-content-region]',
      replaceElement: true,
    },
  },
  template: PreloginTemplate,
  childViewTriggers: {
    'click:login': 'click:login',
  },
});

const NotSetupView = View.extend({
  className: 'prelogin__message',
  template: NotSetupTemplate,
});

const PreloaderView = View.extend({
  className: 'prelogin fill-window',
  regions: {
    content: '[data-content-region]',
  },
  template: PreloginTemplate,
  onRender() {
    if (this.getOption('notSetup')) {
      this.showChildView('content', new NotSetupView());
      return;
    }
  },
  templateContext: {
    dots: range(16),
  },
});

export {
  PreloaderView,
  LoginPromptView,
};
