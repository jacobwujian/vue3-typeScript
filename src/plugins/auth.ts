/**
 * <a-button v-if="$auth('form.edit')">Button</a-button>
 * @param app
 */
import { userStore } from "@/stores/user";
//为解决将$auth挂载到全局是的预编译报错
declare module "vue" {
  interface ComponentCustomProperties {
    $auth: any;
  }
}
export default (app: any) => {
  app.config.globalProperties.$auth = function (permissions: any) {
    const store = userStore();
    const permissionCodes = store.userInfo && store.userInfo.permissionCodes;
    if (permissionCodes && permissionCodes.includes(permissions)) {
      return true;
    } else {
      return false;
    }
  };
};
