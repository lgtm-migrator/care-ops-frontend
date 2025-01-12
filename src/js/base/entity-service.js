import $ from 'jquery';
import { isObject } from 'underscore';
import Backbone from 'backbone';
import { MnObject } from 'marionette';
import { cacheIncluded } from './jsonapi-mixin';

export default MnObject.extend({
  channelName: 'entities',

  Entity: Backbone,

  constructor: function(options) {
    this.mergeOptions(options, ['Entity']);

    MnObject.apply(this, arguments);
  },
  getCollection(models, options = {}) {
    return new this.Entity.Collection(models, options);
  },
  getModel(attrs, options) {
    if (attrs && !isObject(attrs)) attrs = { id: attrs };
    return new this.Entity.Model(attrs, options);
  },
  fetchCollection(options) {
    const collection = new this.Entity.Collection();

    return collection.fetch(options);
  },
  fetchModel(modelId, options) {
    const model = new this.Entity.Model({ id: modelId });

    return model.fetch(options);
  },
  fetchBy(url) {
    const d = $.Deferred();

    $.ajax({ url })
      .done((response, textStatus, jqXHR) => {
        if (!response) {
          d.resolve(null, textStatus, jqXHR);
          return;
        }

        cacheIncluded(response.included);

        const model = new this.Entity.Model({ id: response.data.id });
        model.set(model.parseModel(response.data));

        d.resolve(model, textStatus, jqXHR);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        d.reject(jqXHR, textStatus, errorThrown);
      });

    return d;
  },
});

