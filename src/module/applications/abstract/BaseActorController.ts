import ActorHandler from '../../handlers/ActorHandler';
import { ensureDefined } from '../../util/miscellaneous';

export default class BaseActorController extends Application {
  static apps = new Map<string, BaseActorController>();

  token: Token;
  actor: Actor;
  actorHandler: ActorHandler;

  constructor(appName: string, token: Token, options: Partial<Application.Options>) {
    const id = `${appName}-${token.id}`;
    super(mergeObject(Application.defaultOptions, { resizable: true, width: 600, id, ...options }));
    this.token = token;
    BaseActorController.apps.set(id, this);
    ensureDefined(token.actor, 'token has no actor');
    this.actor = token.actor;
    this.actorHandler = new ActorHandler(this.actor);
  }

  async close(options?: Application.CloseOptions): Promise<void> {
    await super.close(options);
    BaseActorController.apps.delete(this.id);
  }

  static closeById(id: string): boolean {
    const instance = BaseActorController.apps.get(id);
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
