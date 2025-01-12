import { extend } from 'underscore';
import Radio from 'backbone.radio';
import dayjs from 'dayjs';
import store from 'store';

import App from 'js/base/app';

import FormsService from 'js/services/forms';

import PatientSidebarApp from 'js/apps/patients/patient/sidebar/sidebar_app';
import WidgetsHeaderApp from 'js/apps/forms/widgets/widgets_header_app';

import { FormActionsView, LayoutView, IframeView, SaveView, ReadOnlyView, StatusView, StoredSubmissionView } from 'js/views/forms/form/form_views';

export default App.extend({
  childApps: {
    patient: {
      AppClass: PatientSidebarApp,
      regionName: 'sidebar',
      getOptions: ['patient'],
    },
    widgetHeader: {
      AppClass: WidgetsHeaderApp,
      regionName: 'widgets',
      getOptions: ['patient', 'form'],
    },
  },
  initFormState() {
    const storedState = store.get(`form-state_${ this.currentUser.id }`);

    this.setState(extend({ isExpanded: true, saveButtonType: 'save' }, storedState));
  },
  onBeforeStart() {
    this.getRegion().startPreloader();

    this.currentUser = Radio.request('bootstrap', 'currentUser');

    this.initFormState();
  },
  beforeStart({ formId, patientId }) {
    return [
      Radio.request('entities', 'fetch:patients:model', patientId),
      Radio.request('entities', 'forms:model', formId),
    ];
  },
  onBeforeStop() {
    this.removeChildApp('formsService');
  },
  onStart(options, [patient], form) {
    this.patient = patient;
    this.form = form;
    this.isReadOnly = this.form.isReadOnly();

    this.startFormService();

    this.showView(new LayoutView({ model: this.form, patient }));

    this.showContent();

    this.showFormStatus();
    this.showFormSaveDisabled();
    this.showActions();

    this.startChildApp('widgetHeader');

    this.showSidebar();
  },
  startFormService() {
    const formService = this.addChildApp('formsService', FormsService, {
      patient: this.patient,
      form: this.form,
    });

    this.listenTo(formService, {
      'success'(response) {
        response.set({ _created_at: dayjs().format() });

        const saveButtonType = this.getState('saveButtonType');

        if (saveButtonType === 'saveAndGoBack') {
          Radio.request('history', 'go:back');
          return;
        }

        this.showForm(response.id);
        this.showFormStatus(response);
      },
      'ready'() {
        this.showFormSave();
      },
      'error'() {
        this.showFormSave();
      },
    });
  },
  stateEvents: {
    'change': 'onChangeState',
    'change:saveButtonType': 'onChangeSaveButtonType',
  },
  onChangeState() {
    const isExpanded = this.getState('isExpanded');
    const saveButtonType = this.getState('saveButtonType');

    store.set(`form-state_${ this.currentUser.id }`, { isExpanded, saveButtonType });

    this.showSidebar();
  },
  showFormStatus(response) {
    if (this.isReadOnly) return;
    this.showChildView('status', new StatusView({ model: response }));
  },
  showActions() {
    const actionsView = new FormActionsView({
      model: this.getState(),
      patient: this.patient,
    });

    this.listenTo(actionsView, {
      'click:expandButton': this.onClickExpandButton,
    });

    this.showChildView('actions', actionsView);
  },
  onClickExpandButton() {
    this.toggleState('isExpanded');
  },
  showContent() {
    const { updated } = Radio.request(`form${ this.form.id }`, 'get:storedSubmission');

    if (!this.isReadOnly && updated) {
      const storedSubmissionView = this.showChildView('form', new StoredSubmissionView({ updated }));

      this.listenTo(storedSubmissionView, {
        'submit'() {
          this.showForm();
        },
        'cancel'() {
          Radio.request(`form${ this.form.id }`, 'clear:storedSubmission');
          this.showForm();
        },
      });

      return;
    }

    this.showForm();
  },
  showForm(responseId) {
    this.showChildView('form', new IframeView({
      model: this.form,
      responseId,
    }));
  },
  showSidebar() {
    const isExpanded = this.getState('isExpanded');

    if (isExpanded) {
      this.stopChildApp('patient');
      this.getRegion('sidebar').empty();
      return;
    }

    this.startChildApp('patient');
  },
  showFormSaveDisabled() {
    if (this.isReadOnly) {
      this.showChildView('formAction', new ReadOnlyView());
      return;
    }

    this.showChildView('formAction', new SaveView({
      isDisabled: true,
      model: this.getState(),
    }));
  },
  showFormSave() {
    if (this.isReadOnly) return;

    const saveView = this.showChildView('formAction', new SaveView({
      model: this.getState(),
    }));

    this.listenTo(saveView, {
      'click:save'() {
        Radio.request(`form${ this.form.id }`, 'send', 'form:submit');
        this.showFormSaveDisabled();
      },
      'select:button:type'(selectedSaveButtonType) {
        this.setState({ saveButtonType: selectedSaveButtonType });
      },
    });
  },
});
