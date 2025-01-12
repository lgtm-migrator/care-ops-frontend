import 'core-js/modules/web.dom-exception.stack';
import 'core-js/modules/web.structured-clone';
import $ from 'jquery';
import { extend, defer } from 'underscore';
import Radio from 'backbone.radio';

import { fetchConfig, versions } from './config';
import { initDataDog } from './datadog';

function startOutreach() {
  import(/* webpackChunkName: "outreach" */'./outreach/index')
    .then(({ startOutreachApp }) => {
      startOutreachApp();
    });
}

function startForm() {
  import(/* webpackChunkName: "formapp" */'./formapp')
    .then(({ startFormApp }) => {
      startFormApp();
    });
}

function startApp({ name }) {
  import(/* webpackChunkName: "app" */'./app')
    .then(({ default: app }) => {
      app.start({ name });
    });
}

function startFormService() {
  import(/* webpackChunkName: "formservice" */'./formservice')
    .then(({ startFormServiceApp }) => {
      startFormServiceApp();
    });
}

function startAuth() {
  import(/* webpackPrefetch: true, webpackChunkName: "auth" */ './auth')
    .then(({ login, logout }) => {
      login(startApp);
      Radio.reply('auth', {
        logout() {
          logout();
        },
      });
    });
}

const ajaxSetup = {
  contentType: 'application/vnd.api+json',
  statusCode: {
    401() {
      defer(() => {
        Radio.request('auth', 'logout');
      });
    },
    500() {
      Radio.trigger('event-router', 'error');
    },
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const isForm = /^\/formapp\//.test(location.pathname);
  const isOutreach = /^\/outreach\//.test(location.pathname);
  const isFormService = /^\/formservice\//.test(location.pathname);

  if (isFormService) {
    startFormService();
    return;
  }

  if ((_DEVELOP_ || _E2E_) && sessionStorage.getItem('cypress')) {
    versions.frontend = 'cypress';

    if (isOutreach) {
      startOutreach();
      return;
    }

    if (isForm) {
      startForm();
      return;
    }

    $.ajaxSetup(extend(ajaxSetup, {
      beforeSend(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${ sessionStorage.getItem('cypress') }`);
      },
    }));

    startApp({ name: 'Cypress Clinic' });
    return;
  }

  fetchConfig(() => {
    initDataDog({ isForm });

    if (isOutreach) {
      startOutreach();
      return;
    }

    if (isForm) {
      startForm();
      return;
    }

    $.ajaxSetup(ajaxSetup);

    startAuth();
  });
});
