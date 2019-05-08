import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import moment from 'moment';
import Radio from 'backbone.radio';
import * as Marionette from 'marionette';
import { Component } from 'marionette.toolkit';
import DomApi from './domapi';
import './fontawesome';
import './hotkeys';
import './moment';
import 'js/utils/formatting';
import 'js/i18n';

import 'sass/provider-core.scss';

const { Region, View, CollectionView, setDomApi } = Marionette;

setDomApi(DomApi);

$.Deferred.exceptionHook = error => {
  throw error;
};

/* istanbul ignore if */
if (_DEVELOP_) {
  Radio.DEBUG = true;
}

// Expose libraries for the console
window._ = _;
window.$ = $;
window.Backbone = Backbone;
window.Radio = Radio;
window.Marionette = Marionette;
window.moment = moment;

const regionShow = Region.prototype.show;

// Allow for components to be shown directly in regions
Region.prototype.show = function(view, options) {
  if (view instanceof Component) {
    view.showIn(this, options);

    return this;
  }

  return regionShow.call(this, view, options);
};

const getBounds = function(ui) {
  /* istanbul ignore if */
  if (!this.isAttached()) {
    return false;
  }

  // Allow for the user to get the bounds of a different ui elem
  const $el = ui || this.$el;

  const { left, top } = $el.offset();
  const heightOffset = $el.outerHeight();
  const widthOffset = $el.outerWidth();

  return { left, top, heightOffset, widthOffset };
};

_.extend(View.prototype, {
  getBounds,
});

_.extend(CollectionView.prototype, {
  getBounds,
});

Backbone.Model.prototype.moment = function(attr) {
  const date = this.get(attr);

  // return '', null or undefined explicitly
  if (!date && date !== 0) {
    return date;
  }

  return moment(date);
};
