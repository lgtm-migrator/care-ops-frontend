import _ from 'underscore';
import RouterApp from 'js/base/routerapp';

import ProgramsAllApp from 'js/apps/admin/list/programs-all_app';
import ProgramApp from 'js/apps/admin/program/program_app';
import ProgramFlowApp from 'js/apps/admin/program/flow/flow_app';

export default RouterApp.extend({
  routerAppName: 'AdminApp',

  childApps: {
    programsAll: ProgramsAllApp,
    program: ProgramApp,
    programflow: ProgramFlowApp,
  },

  eventRoutes: {
    'programs:all': {
      action: 'showProgramsAll',
      route: 'programs',
      isList: true,
    },
    'program:details': {
      action: 'showProgram',
      route: 'program/:id',
    },
    'program:action': {
      action: 'showProgram',
      route: 'program/:id/action/:id',
    },
    'program:action:new': {
      action: 'showProgram',
      route: 'program/:id/action',
    },
    'program:flow': {
      action: 'showProgramFlow',
      route: 'program/:id/flow/:id',
    },
  },
  showProgramsAll() {
    this.startCurrent('programsAll');
  },
  showProgram(programId) {
    const currentApp = this.getCurrent();
    if (currentApp && _.propertyOf(currentApp.program)('id') === programId) {
      currentApp.startRoute(this.getCurrentRoute());
      return;
    }
    this.startCurrent('program', { programId });
  },
  showProgramFlow(programId, flowId) {
    this.startCurrent('programflow', { programId, flowId });
  },
});
