import { reactive } from 'vue';
interface Modules {
  [key: string]: any;
}
const context: any = import.meta.glob("./modules/*.ts", {
  eager: true
});
const moduleStores: Modules = {};
for (const moduleStore in context) {
  const fileName = moduleStore.slice(10, -3);
  moduleStores[fileName]  = context[moduleStore].default
}

export default moduleStores;
