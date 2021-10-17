export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
  const templatePaths: string[] = [
    // Add paths to "modules/gurps-easy-combat/templates"
  ];
  Handlebars.registerHelper('gurpslink', GURPS.gurpslink);
  Handlebars.registerHelper('isEmptyString', (string: string) => string === '');

  return loadTemplates(templatePaths);
}
