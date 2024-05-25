import { Application } from "express";

export class Modifiers {
    private _instance!: Modifiers
    private readonly title = "Air API - ENJOYS"
    private readonly _events = ["route-matched", "mount", 'connect','connection','close','error','listening','lookup','ready','timeout']
    constructor(private readonly app: Application) {
        this.set()
        this.mount
    }
    /**
     * Set the value of this.app.locals.title to "Air API - ENJOYS"
     *
     */
    private set() {
        this.app.locals.title = this.title
        this.app.disable('x-powered-by')
        this.app.set('trust proxy', 1)
        this.app.set('title', this.title);
    }

    /**
     * Mounts the application.
     */
    private mount() {
        this.app.on('mount', (parent) => console.log('Application Mounted'))
       this._events.forEach((event) => this.app.on(event, () => console.log(event)))
       
    }
    static useRoot(app: Application) {
        if (!this.prototype._instance) {
            this.prototype._instance = new Modifiers(app)
            return
        }
        return this.prototype._instance
    }
}