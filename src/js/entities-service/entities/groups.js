import $ from 'jquery';
import _ from 'underscore';
import Radio from 'backbone.radio';
import Store from 'backbone.store';
import BaseCollection from 'js/base/collection';
import BaseModel from 'js/base/model';

const TYPE = 'groups';

const _Model = BaseModel.extend({
  type: TYPE,
  urlRoot: '/api/groups',
  getClinicians() {
    return Radio.request('entities', 'clinicians:collection', this.get('_clinicians'));
  },
  addClinician(clinician) {
    const url = `/api/groups/${ this.id }/relationships/clinicians`;
    const groups = clinician.get('_groups') || [];

    clinician.set({ _groups: _.union(groups, [{ id: this.id }]) });

    this.set({ _clinicians: _.union(this.get('_clinicians'), [{ id: clinician.id }]) });

    $.ajax({
      type: 'POST',
      url,
      data: JSON.stringify({
        data: [{
          id: clinician.id,
          type: clinician.type,
        }],
      }),
    });
  },
  removeClinician(clinician) {
    const url = `/api/groups/${ this.id }/relationships/clinicians`;

    clinician.set({ _groups: _.reject(clinician.get('_groups'), { id: this.id }) });

    this.set({
      _clinicians: _.reject(this.get('_clinicians'), { id: clinician.id }),
    });

    $.ajax({
      type: 'DELETE',
      url,
      data: JSON.stringify({
        data: [{
          id: clinician.id,
          type: clinician.type,
        }],
      }),
    });
  },
});

const Model = Store(_Model, TYPE);
const Collection = BaseCollection.extend({
  url: '/api/groups',
  model: Model,
});

export {
  _Model,
  Model,
  Collection,
};
