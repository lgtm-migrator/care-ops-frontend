import $ from 'jquery';
import { bind, extend, isEmpty, pick, reduce, result } from 'underscore';
import Backbone from 'backbone';
import { getActiveXhr, registerXhr } from './control';
import JsonApiMixin from './jsonapi-mixin';

export default Backbone.Model.extend(extend({
  destroy(options) {
    if (this.isNew()) {
      Backbone.Model.prototype.destroy.call(this, options);
      return $.Deferred().resolve(options);
    }

    return Backbone.Model.prototype.destroy.call(this, options);
  },
  fetch(options) {
    // Model fetches default to aborting.
    options = extend({ abort: true }, options);

    const baseUrl = options.url || result(this, 'url');
    let xhr = getActiveXhr(baseUrl, options);

    /* istanbul ignore if */
    if (!xhr) {
      xhr = Backbone.Model.prototype.fetch.call(this, options);

      registerXhr(baseUrl, xhr);
    }

    // On success resolves the entity instead of the jqxhr success
    const d = $.Deferred();

    $.when(xhr)
      .fail(bind(d.reject, d))
      .done(bind(d.resolve, d, this));

    return d;
  },
  parse(response) {
    /* istanbul ignore if */
    if (!response || !response.data) return response;

    this.cacheIncluded(response.included);

    return this.parseModel(response.data);
  },
  parseErrors({ errors }) {
    if (!errors) return;

    const attrPointer = '/data/attributes/';

    return reduce(errors, (parsedErrors, { source, detail }) => {
      const key = String(source.pointer).slice(attrPointer.length);
      parsedErrors[key] = detail;
      return parsedErrors;
    }, {});
  },
  removeFEOnly(attrs) {
    // Removes id and frontend _fields for POST/PATCHes
    return pick(attrs, function(value, key) {
      return key !== 'id' && /^[^_]/.test(key);
    });
  },
  toJSONApi(attributes = this.attributes) {
    return {
      id: this.id,
      type: this.type,
      attributes: this.removeFEOnly(attributes),
    };
  },
  save(attrs, data = {}, opts) {
    // Supports the prototype overloading
    if (attrs == null) opts = data;

    data = extend(this.toJSONApi(data.attributes || attrs), data);

    if (isEmpty(data.attributes)) delete data.attributes;

    opts = extend({
      patch: !this.isNew(),
      data: JSON.stringify({ data }),
    }, opts);

    return Backbone.Model.prototype.save.call(this, attrs, opts);
  },
  isCached() {
    return this.has('__cached_ts');
  },
}, JsonApiMixin));
