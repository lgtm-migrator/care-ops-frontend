import _ from 'underscore';
import Radio from 'backbone.radio';
import hbs from 'handlebars-inline-precompile';
import { View } from 'marionette';

import 'sass/modules/table-list.scss';
import 'sass/modules/progress-bar.scss';

import { PatientStatusIcons } from 'js/static';

import { StateComponent, OwnerComponent } from 'js/views/patients/actions/actions_views';

import FlowItemTemplate from './flow-item.hbs';

import 'sass/domain/action-state.scss';
import './worklist-list.scss';

const FlowTooltipTemplate = hbs`{{formatMessage (intlGet "patients.worklist.flowViews.flowListTooltips") title=worklistId role=role}}`;

const FlowEmptyView = View.extend({
  tagName: 'tr',
  template: hbs`
    <td class="table-empty-list">
      <h2>{{ @intl.patients.worklist.flowViews.flowEmptyView }}</h2>
    </td>
  `,
});

const ReadOnlyFlowStateView = View.extend({
  tagName: 'span',
  className: 'worklist-list__flow-status',
  template: hbs`<span class="action--{{ statusClass }}">{{fas statusIcon}}</span>{{~ remove_whitespace ~}}`,
  templateContext() {
    const status = this.model.getState().get('status');

    return {
      statusClass: _.dasherize(status),
      statusIcon: PatientStatusIcons[status],
    };
  },
});

const FlowItemView = View.extend({
  className: 'table-list__item',
  tagName: 'tr',
  template: FlowItemTemplate,
  regions: {
    state: '[data-state-region]',
    owner: '[data-owner-region]',
  },
  templateContext() {
    return {
      patient: this.model.getPatient().attributes,
    };
  },
  triggers: {
    'click': 'click',
    'click .js-patient': 'click:patient',
  },
  onClick() {
    Radio.trigger('event-router', 'flow', this.model.id);
  },
  onClickPatient() {
    Radio.trigger('event-router', 'patient:dashboard', this.model.get('_patient'));
  },
  onRender() {
    this.showState();
    this.showOwner();
  },
  showState() {
    if (!this.model.isDone()) {
      const readOnlyStateView = new ReadOnlyFlowStateView({ model: this.model });
      this.showChildView('state', readOnlyStateView);
      return;
    }

    const stateComponent = new StateComponent({ model: this.model, isCompact: true });

    this.listenTo(stateComponent, 'change:state', state => {
      this.model.saveState(state);
    });

    this.showChildView('state', stateComponent);
  },
  showOwner() {
    const isDisabled = this.model.isDone();
    const ownerComponent = new OwnerComponent({ model: this.model, isCompact: true, state: { isDisabled } });

    this.listenTo(ownerComponent, 'change:owner', owner => {
      this.model.saveOwner(owner);
    });

    this.showChildView('owner', ownerComponent);
  },
});

export {
  FlowTooltipTemplate,
  FlowEmptyView,
  FlowItemView,
};
