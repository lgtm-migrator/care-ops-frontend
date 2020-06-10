import _ from 'underscore';
import moment from 'moment';
import store from 'store';

import Backbone from 'backbone';
import Radio from 'backbone.radio';

import App from 'js/base/app';

import FiltersApp from './filters_app';

import { ListView, TooltipView, LayoutView, TableHeaderView, SortDroplist, sortDueOptions, sortUpdateOptions } from 'js/views/patients/worklist/worklist_views_legacy';

const StateModel = Backbone.Model.extend({
  defaults() {
    return {
      actionsSortId: 'sortUpdateDesc',
      flowsSortId: 'sortUpdateDesc',
      filters: {
        type: 'flows',
        groupId: null,
        clinicianId: this.currentClinician.id,
      },
    };
  },
  preinitialize() {
    this.currentClinician = Radio.request('bootstrap', 'currentUser');
    this.groups = this.currentClinician.getGroups();
  },
  initialize() {
    this.on('change', this.onChange);
  },
  onChange() {
    store.set(this.id, this.attributes);
  },
  getFilters() {
    return _.clone(this.get('filters'));
  },
  getType() {
    return this.getFilters().type;
  },
  isFlowType() {
    return this.getType() === 'flows';
  },
  getSort() {
    return this.get(`${ this.getType() }SortId`);
  },
  setSort(sortId) {
    this.set(`${ this.getType() }SortId`, sortId);
  },
  getEntityFilter() {
    const { groupId, clinicianId } = this.getFilters();
    const group = groupId || this.groups.pluck('id').join(',');
    const status = 'queued,started';

    const filters = {
      'owned-by': { clinician: clinicianId, status, group },
      'for-my-role': {
        role: this.currentClinician.getRole().id,
        status,
        group,
      },
      'new-past-day': {
        created_since: moment().subtract(24, 'hours').format(),
        status,
        group,
      },
      'updated-past-three-days': {
        updated_since: moment().startOf('day').subtract(3, 'days').format(),
        status,
        group,
      },
      'done-last-thirty-days': {
        updated_since: moment().startOf('day').subtract(30, 'days').format(),
        status: 'done',
        group,
      },
    };

    return filters[this.id];
  },
});

export default App.extend({
  StateModel,
  childApps: {
    filters: {
      AppClass: FiltersApp,
      regionName: 'filters',
      restartWithParent: false,
      getOptions: ['currentClinician'],
    },
  },
  stateEvents: {
    'change:filters': 'restart',
    'change:actionsSortId': 'onChangeStateSort',
    'change:flowsSortId': 'onChangeStateSort',
  },
  onChangeStateSort() {
    this.getChildView('list').setComparator(this.getComparator());
  },
  initListState() {
    const storedState = store.get(this.worklistId);
    this.setState(_.extend({ id: this.worklistId }, storedState));
  },
  onBeforeStart({ worklistId }) {
    if (this.isRestarting()) {
      this.showTooltip();
      this.showSortDroplist();
      this.showTableHeaders();
      this.getRegion('list').startPreloader();
      return;
    }

    this.worklistId = worklistId;
    this.initListState();

    this.showView(new LayoutView({
      worklistId: this.worklistId,
    }));

    this.getRegion('list').startPreloader();
    this.showSortDroplist();
    this.showTableHeaders();
    this.showTooltip();

    const filtersApp = this.startChildApp('filters', {
      state: this.getState().getFilters(),
      shouldShowClinician: this.getState().id === 'owned-by',
    });

    this.listenTo(filtersApp.getState(), 'change', ({ attributes }) => {
      this.setState({ filters: _.clone(attributes) });
    });
  },
  beforeStart() {
    const filter = this.getState().getEntityFilter();
    return Radio.request('entities', `fetch:${ this.getState().getType() }:collection`, { filter });
  },
  onStart(options, collection) {
    const collectionView = new ListView({
      collection,
      isFlowList: this.getState().isFlowType(),
      viewComparator: this.getComparator(),
    });

    this.showChildView('list', collectionView);
  },
  getComparator() {
    const sortId = this.getState().getSort();
    return this.sortOptions.get(sortId).get('comparator');
  },
  getSortOptions() {
    if (this.getState().isFlowType()) {
      return sortUpdateOptions;
    }

    return _.union(sortDueOptions, sortUpdateOptions);
  },
  showSortDroplist() {
    this.sortOptions = new Backbone.Collection(this.getSortOptions());

    const sortSelect = new SortDroplist({
      collection: this.sortOptions,
      state: { selected: this.sortOptions.get(this.getState().getSort()) },
    });

    this.listenTo(sortSelect.getState(), 'change:selected', (state, selected) => {
      this.getState().setSort(selected.id);
    });

    this.showChildView('sort', sortSelect);
  },
  showTableHeaders() {
    const tableHeadersView = new TableHeaderView({
      isFlowList: this.getState().isFlowType(),
    });

    this.showChildView('table', tableHeadersView);
  },
  showTooltip() {
    const tooltipView = new TooltipView({
      isFlowList: this.getState().isFlowType(),
      worklistId: this.worklistId,
    });

    this.showChildView('tooltip', tooltipView);
  },
});
