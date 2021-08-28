export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
  const templatePaths: string[] = [
    // Add paths to "modules/gurps-easy-combat/templates"
  ];

  return loadTemplates(templatePaths);
}
