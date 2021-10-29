export default function controllerFactory() {
  class Controller extends Application {
    actor: Actor;

    static apps = new Map<string, Controller>();

    constructor(appName: string, actor: Actor, options: Partial<Application.Options>) {
      const id = `${appName}-${actor.id}`;
      super(mergeObject(Application.defaultOptions, { resizable: true, width: 600, id, ...options }));
      this.actor = actor;
      if (!this.actor) {
        throw new Error('no actor');
      }
      Controller.apps.set(id, this);
    }

    async close(options?: Application.CloseOptions): Promise<void> {
      await super.close(options);
      Controller.apps.delete(this.id);
    }

    static closeById(id: string): boolean {
      const instance = Controller.apps.get(id);
      if (!instance) return false;
      instance.close();
      return true;
    }

    closeForEveryone(): void {
      EasyCombat.socket.executeForEveryone('closeController', this.id);
    }

    static async closeAll(): Promise<void> {
      await Promise.all(
        [...this.apps.values()].map(async (app) => {
          if (app instanceof this) {
            await app.close();
          }
        }),
      );
    }
  }
  return Controller;
}
