class Logger {
  info(message, context = {}) {
    this.log('INFO', message, context);
  }

  warn(message, context = {}) {
    this.log('WARN', message, context);
  }

  error(message, context = {}) {
    this.log('ERROR', message, context);
  }

  debug(message, context = {}) {
    if (process.env.DEBUG_LOGS === 'true') {
      this.log('DEBUG', message, context);
    }
  }

  log(level, message, context) {
    const payload = Object.keys(context).length ? ` ${JSON.stringify(context)}` : '';
    console.log(`[${new Date().toISOString()}] [${level}] ${message}${payload}`);
  }
}

module.exports = new Logger();
