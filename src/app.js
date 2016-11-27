export class App {
  configureRouter(config, router) {
    config.title = 'Open Connections';
    config.map([
      { route: '', moduleId: 'rooms', title: 'Rooms' },
      { route: 'room/:id', moduleId: 'room', name: 'room' }
    ]);

    this.router = router;
  }
}
