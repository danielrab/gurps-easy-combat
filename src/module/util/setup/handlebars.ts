import { TEMPLATES_FOLDER } from '../../data/constants';

export function registerHelpers(): void {
  Handlebars.registerHelper('gurpslink', GURPS.gurpslink);
  Handlebars.registerHelper('isEmptyString', (string: string) => string === '');
  Handlebars.registerHelper('get', (obj, prop) => obj[prop]);
}

export async function registerPartials(): Promise<void> {
  Handlebars.registerPartial('choiceTable', await getTemplate(`${TEMPLATES_FOLDER}/partials/choiceTable.hbs`));
}
