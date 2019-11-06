import $ from 'jquery';
import Radio from 'backbone.radio';

import App from 'js/base/app';

export default App.extend({
  channelName: 'bootstrap',
  radioRequests: {
    'currentUser': 'getCurrentUser',
    'currentOrg': 'getCurrentOrg',
    'fetch': 'fetchBootstrap',
  },
  initialize({ name }) {
    this.bootstrapPromise = $.Deferred();
    this.currentOrg = Radio.request('entities', 'organizations:model', { name });
  },
  getCurrentUser() {
    return this.currentUser;
  },
  getCurrentOrg() {
    return this.currentOrg;
  },
  beforeStart() {
    return [
      Radio.request('entities', 'fetch:clinicians:current'),
      Radio.request('entities', 'fetch:roles:collection'),
      Radio.request('entities', 'fetch:states:collection'),
      Radio.request('entities', 'fetch:groups:collection'),
      Radio.request('entities', 'fetch:clinicians:collection'),
    ];
  },
  onStart(options, [currentUser], [roles], [states]) {
    this.currentUser = currentUser;
    this.currentOrg.set({ states, roles });
    this.bootstrapPromise.resolve();
  },
  fetchBootstrap() {
    this.start();

    return this.bootstrapPromise;
  },
});
