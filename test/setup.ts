// Every RequestHandler registers SIGTERM/SIGINT/SIGHUP listeners and these suites
// build one per plugin in a single process, so Node's default limit of 10 warns.
process.setMaxListeners(0);
