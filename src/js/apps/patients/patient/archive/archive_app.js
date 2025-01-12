import Backbone from 'backbone';
import Radio from 'backbone.radio';

import App from 'js/base/app';

import { STATE_STATUS } from 'js/static';

import { LayoutView, ListView } from 'js/views/patients/patient/archive/archive_views';

export default App.extend({
  onBeforeStart({ patient }) {
    this.showView(new LayoutView({ model: patient }));
    this.getRegion('content').startPreloader();
  },
  beforeStart({ patient }) {
    const filter = { status: STATE_STATUS.DONE };

    return [
      Radio.request('entities', 'fetch:actions:collection:byPatient', { patientId: patient.id, filter }),
      Radio.request('entities', 'fetch:flows:collection:byPatient', { patientId: patient.id, filter }),
    ];
  },
  onStart({ patient }, [actions], [flows]) {
    this.collection = new Backbone.Collection([...actions.models, ...flows.models]);
    this.showChildView('content', new ListView({ collection: this.collection }));
  },
  onEditAction(action) {
    action.trigger('editing', true);
  },
});
