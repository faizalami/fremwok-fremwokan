window.loggerConfig = {
  state: false,
  props: false,
  computed: false,
  methods: false,
  dependency: false,
};

export function log (source, message) {
  if (window.loggerConfig[source]) {
    console.log(`%c${source}: `, 'font-weight: bold', message);
  }
}
