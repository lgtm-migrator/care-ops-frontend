import _ from 'underscore';
import Radio from 'backbone.radio';
import Store from 'backbone.store';
import BaseCollection from 'js/base/collection';
import BaseModel from 'js/base/model';

const TYPE = 'patients';

const _Model = BaseModel.extend({
  type: TYPE,
  urlRoot: '/api/patients',
  getGroups() {
    return Radio.request('entities', 'groups:collection', this.get('_groups'));
  },
});

const Model = Store(_Model, TYPE);
const Collection = BaseCollection.extend({
  url: '/api/patients',
  model: Model,
  getSharedGroups() {
    const allGroupModels = _.pluck(this.invoke('getGroups'), 'models');
    return Radio.request('entities', 'groups:collection', _.intersection(...allGroupModels));
  },
});

export {
  Model,
  _Model,
  Collection,
};
