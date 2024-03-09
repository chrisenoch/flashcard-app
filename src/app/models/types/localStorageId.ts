//LocalStorageIds must be unique. E.g. the same component must use separate ids if it is a separate entity in the app.
//Convention: <explanation/purpose>-<result of Date.now()> If we have a large app, two separate components may use the same localStorage id by mistake. If we add the result of Date.now() on the end, it is almost impossible that this will happen.
//Do not update ids just because the date has changed.
//Just because we have the Date.now() safeguard, you should still give your id a unique name. Don't reuse 'tip' for example. Please be more explicit.
//When you crate a localStorageId, add the id to this type.

export type LocalStorageId = 'explanation-of-app-1709991594775';
