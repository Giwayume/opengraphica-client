import Vue from 'vue';

export async function openDialog(name, props) {
    let dialogComponentModule;
    switch(name) {
        case 'export': dialogComponentModule = await import(/* webpackChunkName: 'export-dialog' */ '@/components/dialogs/export-dialog'); break;
        case 'insert-image': dialogComponentModule = await import(/* webpackChunkName: 'insert-image-dialog' */ '@/components/dialogs/insert-image-dialog'); break;
        case 'menu': dialogComponentModule = await import(/* webpackChunkName: 'menu-dialog' */ '@/components/dialogs/menu-dialog'); break;
        default: break;
    }
    if (!dialogComponentModule) {
        throw new Error('[openDialog] Dialog not found: ' + name);
    }
    const DialogComponent = dialogComponentModule.default;
    const vue = new Vue({
        render(createElement) {
            return createElement('b-modal', {
                props: {
                    title: this.title,
                    headerBgVariant: 'dark',
                    headerTextVariant: 'white',
                    bodyBgVariant: 'dark',
                    bodyTextVariant: 'white',
                    footerBgVariant: 'dark',
                    footerTextVariant: 'white',
                    centered: true,
                    hideFooter: true,
                    size: DialogComponent.modalSize,
                    visible: this.visible
                },
                on: {
                    hidden: this.onModalHidden
                }
            }, [
                createElement('dialog-component', {
                    props: this.props,
                    on: {
                        dismiss: () => {
                            this.visible = false;
                        }
                    }
                })
            ]);
        },
        components: {
            'dialog-component': DialogComponent
        },
        data: {
            title: DialogComponent.title,
            visible: true,
            props
        },
        methods: {
            onModalHidden() {
                vue.$el.parentNode.removeChild(vue.$el);
                vue.$destroy();
            }
        }
    });
    vue.$mount();
    document.body.appendChild(vue.$el);
}
