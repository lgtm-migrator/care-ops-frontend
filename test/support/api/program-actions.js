import _ from 'underscore';
import { getResource, getRelationship } from 'helpers/json-api';

Cypress.Commands.add('routeProgramAction', (mutator = _.identity) => {
  cy
    .fixture('collections/program-actions').as('fxProgramActions');

  cy.route({
    url: '/api/program-actions/*',
    response() {
      return mutator({
        data: getResource(_.sample(this.fxProgramActions), 'program-actions'),
        included: [],
      });
    },
  })
    .as('routeProgramAction');
});

Cypress.Commands.add('routeProgramActions', (mutator = _.identity, programId) => {
  cy
    .fixture('collections/program-actions').as('fxProgramActions')
    .fixture('collections/programs').as('fxPrograms')
    .fixture('test/teams').as('fxTeams');

  cy.route({
    url: '/api/programs/**/relationships/actions*',
    response() {
      const data = getResource(_.sample(this.fxProgramActions, 20), 'program-actions');
      const program = _.sample(this.fxPrograms);
      program.id = programId;

      _.each(data, action => {
        action.relationships = {
          program: { data: getRelationship(program, 'programs') },
          owner: { data: _.random(1) ? null : getRelationship(_.sample(this.fxTeams), 'teams') },
          form: { data: null },
        };
      });

      return mutator({
        data,
        included: [],
      });
    },
  })
    .as('routeProgramActions');
});

Cypress.Commands.add('routeProgramFlowActions', (mutator = _.identity, flowId = '1') => {
  cy
    .fixture('collections/program-actions').as('fxProgramActions')
    .fixture('collections/programs').as('fxPrograms')
    .fixture('collections/program-flows').as('fxProgramFlows')
    .fixture('test/teams').as('fxTeams');

  cy.route({
    url: '/api/program-flows/**/actions',
    response() {
      const data = getResource(_.sample(this.fxProgramActions, 20), 'program-actions');
      const program = _.sample(this.fxPrograms);
      const programFlow = _.sample(this.fxProgramFlows);
      programFlow.id = flowId;

      _.each(data, action => {
        action.relationships = {
          'program-flow': { data: getRelationship(programFlow, 'program-flows') },
          'program': { data: getRelationship(program, 'programs') },
          'owner': { data: _.random(1) ? null : getRelationship(_.sample(this.fxTeams), 'teams') },
          'form': { data: null },
        };
      });

      return mutator({
        data,
        included: [],
      });
    },
  })
    .as('routeProgramFlowActions');
});

Cypress.Commands.add('routeAllProgramActions', (mutator = _.identity, programIds) => {
  cy
    .fixture('collections/program-actions').as('fxProgramActions')
    .fixture('collections/programs').as('fxPrograms')
    .fixture('test/teams').as('fxTeams');

  cy.route({
    url: '/api/program-actions?*',
    response() {
      const data = getResource(_.sample(this.fxProgramActions, 20), 'program-actions');
      const program = _.sample(this.fxPrograms);
      program.id = _.sample(programIds);

      _.each(data, action => {
        action.relationships = {
          program: { data: getRelationship(program, 'programs') },
          owner: { data: _.random(1) ? null : getRelationship(_.sample(this.fxTeams), 'teams') },
          form: { data: null },
        };
      });

      return mutator({
        data,
        included: [],
      });
    },
  })
    .as('routeAllProgramActions');
});

