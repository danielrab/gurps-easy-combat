export function registerHelpers(): void {
  Handlebars.registerHelper('gurpslink', GURPS.gurpslink);
  Handlebars.registerHelper('isEmptyString', (string: string) => string === '');
}
