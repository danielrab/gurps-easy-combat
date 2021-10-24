export default abstract class BaseActorController extends Application {
  actor: Actor;

  constructor(actor: Actor, options: { template: string; title: string } & Partial<Application.Options>) {
    super(mergeObject(Application.defaultOptions, { resizable: true, ...options }));
    this.actor = actor;
    if (!this.actor) ui.notifications?.warn('You must have a character selected');
    this.render(true);
  }

  abstract getData(): Record<string, unknown> | Promise<Record<string, unknown>>;
}
