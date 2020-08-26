import Vue from 'vue';
import { Loading, MessageBox, Message, Notification } from 'element-ui';
import vietnameseLang from 'element-ui/lib/locale/lang/vi';
import locale from 'element-ui/lib/locale';
import { elComponent } from '@/constants/app.enum';

/**
 * Element UI CSS
 */
import 'element-ui/lib/theme-chalk/button.css';
import 'element-ui/lib/theme-chalk/checkbox.css';
import 'element-ui/lib/theme-chalk/col.css';
import 'element-ui/lib/theme-chalk/container.css';
import 'element-ui/lib/theme-chalk/date-picker.css';
import 'element-ui/lib/theme-chalk/dialog.css';
import 'element-ui/lib/theme-chalk/display.css';
import 'element-ui/lib/theme-chalk/dropdown-item.css';
import 'element-ui/lib/theme-chalk/dropdown-menu.css';
import 'element-ui/lib/theme-chalk/dropdown.css';
import 'element-ui/lib/theme-chalk/form-item.css';
import 'element-ui/lib/theme-chalk/form.css';
import 'element-ui/lib/theme-chalk/icon.css';
import 'element-ui/lib/theme-chalk/input.css';
import 'element-ui/lib/theme-chalk/loading.css';
import 'element-ui/lib/theme-chalk/message-box.css';
import 'element-ui/lib/theme-chalk/message.css';
import 'element-ui/lib/theme-chalk/notification.css';
import 'element-ui/lib/theme-chalk/pagination.css';
import 'element-ui/lib/theme-chalk/row.css';
import 'element-ui/lib/theme-chalk/step.css';
import 'element-ui/lib/theme-chalk/steps.css';
import 'element-ui/lib/theme-chalk/tab-pane.css';
import 'element-ui/lib/theme-chalk/table-column.css';
import 'element-ui/lib/theme-chalk/table.css';
import 'element-ui/lib/theme-chalk/tabs.css';
import 'element-ui/lib/theme-chalk/tree.css';
import 'element-ui/lib/theme-chalk/autocomplete.css';
import 'element-ui/lib/theme-chalk/radio.css';
import 'element-ui/lib/theme-chalk/radio-group.css';
import 'element-ui/lib/theme-chalk/avatar.css';
import 'element-ui/lib/theme-chalk/upload.css';
import 'element-ui/lib/theme-chalk/tooltip.css';
import 'element-ui/lib/theme-chalk/select.css';
import 'element-ui/lib/theme-chalk/option.css';
import 'element-ui/lib/theme-chalk/popover.css';
import 'element-ui/lib/theme-chalk/page-header.css';
import 'element-ui/lib/theme-chalk/tag.css';
import 'element-ui/lib/theme-chalk/drawer.css';

// configure default language
locale.use(vietnameseLang);

// import dynamic components
Vue.component(elComponent.ElRow, () => import(/* webpackChunkName: 'element-ui-form-row' */ 'element-ui/lib/row'));
Vue.component(elComponent.ElCol, () => import(/* webpackChunkName: 'element-ui-form-col' */ 'element-ui/lib/col'));
Vue.component(elComponent.ElContainer, () => import(/* webpackChunkName: 'element-ui-form-col' */ 'element-ui/lib/container'));
Vue.component(elComponent.ElButton, () => import(/* webpackChunkName: 'element-ui-button' */ 'element-ui/lib/button'));
Vue.component(elComponent.ElInput, () => import(/* webpackChunkName: 'element-ui-input' */ 'element-ui/lib/input'));
Vue.component(elComponent.ElForm, () => import(/* webpackChunkName: 'element-ui-form' */ 'element-ui/lib/form'));
Vue.component(elComponent.ElFormItem, () => import(/* webpackChunkName: 'element-ui-form-item' */ 'element-ui/lib/form-item'));
Vue.component(elComponent.ElStep, () => import(/* webpackChunkName: 'element-ui-form-step' */ 'element-ui/lib/step'));
Vue.component(elComponent.ElSteps, () => import(/* webpackChunkName: 'element-ui-form-steps' */ 'element-ui/lib/steps'));
Vue.component(elComponent.ElPagination, () => import(/* webpackChunkName: 'element-ui-form-pagination' */ 'element-ui/lib/pagination'));
Vue.component(elComponent.ElDatePicker, () => import(/* webpackChunkName: 'element-ui-form-date-picker' */ 'element-ui/lib/date-picker'));
Vue.component(elComponent.ElDropdown, () => import(/* webpackChunkName: 'element-ui-form-dropdown' */ 'element-ui/lib/dropdown'));
Vue.component(elComponent.ElDropdownItem, () => import(/* webpackChunkName: 'element-ui-form-dropdown-item' */ 'element-ui/lib/dropdown-item'));
Vue.component(elComponent.ElDropdownMenu, () => import(/* webpackChunkName: 'element-ui-form-dropdown-menu' */ 'element-ui/lib/dropdown-menu'));
Vue.component(elComponent.ElTree, () => import(/* webpackChunkName: 'element-ui-form-tree' */ 'element-ui/lib/tree'));
Vue.component(elComponent.ElTable, () => import(/* webpackChunkName: 'element-ui-form-table' */ 'element-ui/lib/table'));
Vue.component(elComponent.ElTableColumn, () => import(/* webpackChunkName: 'element-ui-form-table-column' */ 'element-ui/lib/table-column'));
Vue.component(elComponent.ElTabPane, () => import(/* webpackChunkName: 'element-ui-form-tab-pane' */ 'element-ui/lib/tab-pane'));
Vue.component(elComponent.ElTabs, () => import(/* webpackChunkName: 'element-ui-form-tabs' */ 'element-ui/lib/tabs'));
Vue.component(elComponent.ElCheckbox, () => import(/* webpackChunkName: 'element-ui-checkbox' */ 'element-ui/lib/checkbox'));
Vue.component(elComponent.ElIcon, () => import(/* webpackChunkName: 'element-ui-icon' */ 'element-ui/lib/icon'));
Vue.component(elComponent.ElRadio, () => import(/* webpackChunkName: 'element-ui-radio' */ 'element-ui/lib/radio'));
Vue.component(elComponent.ElRadioGroup, () => import(/* webpackChunkName: 'element-radio-group' */ 'element-ui/lib/radio-group'));
Vue.component(elComponent.ElDialog, () => import(/* webpackChunkName: 'element-ui-dialog' */ 'element-ui/lib/dialog'));
Vue.component(elComponent.ElAutocomplete, () => import(/* webpackChunkName: 'element-ui-autocomplete' */ 'element-ui/lib/autocomplete'));
Vue.component(elComponent.ElTooltip, () => import(/* webpackChunkName: 'element-ui-tooltip' */ 'element-ui/lib/tooltip'));
Vue.component(elComponent.ElSelect, () => import(/* webpackChunkName: 'element-ui-select' */ 'element-ui/lib/select'));
Vue.component(elComponent.ElOption, () => import(/* webpackChunkName: 'element-ui-option' */ 'element-ui/lib/option'));
Vue.component(elComponent.ElAvatar, () => import(/* webpackChunkName: 'element-ui-avatar' */ 'element-ui/lib/avatar'));
Vue.component(elComponent.ElUpload, () => import(/* webpackChunkName: 'element-ui-upload' */ 'element-ui/lib/upload'));
Vue.component(elComponent.ElTooltip, () => import(/* webpackChunkName: 'element-ui-tooltip' */ 'element-ui/lib/tooltip'));
Vue.component(elComponent.ElProgress, () => import(/* webpackChunkName: 'element-ui-progress' */ 'element-ui/lib/progress'));
Vue.component(elComponent.ElPopover, () => import(/* webpackChunkName: 'element-ui-popover' */ 'element-ui/lib/popover'));
Vue.component(elComponent.ElPageHeader, () => import(/* webpackChunkName: 'element-ui-page-header' */ 'element-ui/lib/page-header'));
Vue.component(elComponent.ElTag, () => import(/* webpackChunkName: 'element-tag' */ 'element-ui/lib/tag'));
Vue.component(elComponent.ElDrawer, () => import(/* webpackChunkName: 'element-ui-drawer' */ 'element-ui/lib/drawer'));
// import prototype Vue
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;
