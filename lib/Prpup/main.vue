<template>
  <transition
    name="ueb-dialog-fade"
    @after-leave="afterLeave">
    <div class="ueb-dialog__wrapper" v-show="visible" @click.self="handleWrapperClick">
      <div
        class="el-dialog"
        :class="[{'is-fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
        ref="dialog"
        :style="style">
        <div class="el-dialog__header">
          <slot name="title">
            <span class="el-dialog__title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="el-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose">
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-dialog__body" v-if="rendered"><slot></slot></div>
        <div class="el-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Popup from 'element-ui/src/utils/popup';
  import Migrating from 'element-ui/src/mixins/migrating';
  import emitter from 'element-ui/src/mixins/emitter';
  export default {
    name: 'ueb-dialog',
    mixins: [Popup, emitter, Migrating],
    props: {
      title: {
        type: String,
        default: ''
      },
      modal: {
        type: Boolean,
        default: true
      },
      modalAppendToBody: {
        type: Boolean,
        default: true
      },
      appendToBody: {
        type: Boolean,
        default: false
      },
      lockScroll: {
        type: Boolean,
        default: true
      },
      closeOnClickModal: {
        type: Boolean,
        default: true
      },
      closeOnPressEscape: {
        type: Boolean,
        default: true
      },
      showClose: {
        type: Boolean,
        default: true
      },
      width: {
        type:String,
        default:"100%"
      },
      fullscreen: Boolean,
      customClass: {
        type: String,
        default: ''
      },
      top: {
        type: String,
        default: '15vh'
      },
      beforeClose: Function,
      center: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        closed: false
      };
    },
    watch: {
      visible(val) {
        if (val) {
          this.closed = false;
          this.$emit('open');
          this.$el.addEventListener('scroll', this.updatePopper);
          this.$nextTick(() => {
            this.$refs.dialog.scrollTop = 0;
          });
          if (this.appendToBody) {
            document.body.appendChild(this.$el);
          }
        } else {
          this.$el.removeEventListener('scroll', this.updatePopper);
          if (!this.closed) this.$emit('close');
        }
      }
    },
    computed: {
      style() {
        let style = {};
        if (this.width) {
          style.width = this.width;
        }
        if (!this.fullscreen) {
          style.marginTop = this.top;
        }
        return style;
      }
    },
    methods: {
      getMigratingConfig() {
        return {
          props: {
            'size': 'size is removed.'
          }
        };
      },
      handleWrapperClick() {
        if (!this.closeOnClickModal) return;
        this.handleClose();
      },
      handleClose() {
        if (typeof this.beforeClose === 'function') {
          this.beforeClose(this.hide);
        } else {
          this.hide();
        }
      },
      hide(cancel) {
        if (cancel !== false) {
          this.$emit('update:visible', false);
          this.$emit('close');
          this.closed = true;
        }
      },
      updatePopper() {
        this.broadcast('ElSelectDropdown', 'updatePopper');
        this.broadcast('ElDropdownMenu', 'updatePopper');
      },
      afterLeave() {
        this.$emit('closed');
      }
    },
    mounted() {
      if (this.visible) {
        this.rendered = true;
        this.open();
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
      }
    },
    destroyed() {
      // if appendToBody is true, remove DOM node after destroy
      if (this.appendToBody && this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    }
  };
</script>

<style lang='less' scoped>
   .ueb-dialog__wrapper{
      position: fixed;
      top: 70px;
      right: 0;
      bottom: 0;
      overflow: auto;
      margin: 0;
      width: 990px;
   }
   .ueb-dialog-fade-enter-active{-webkit-animation:ueb-dialog-fade-in .3s;animation:ueb-dialog-fade-in .3s}
   .ueb-dialog-fade-leave-active{-webkit-animation:ueb-dialog-fade-out .3s;animation:ueb-dialog-fade-out .3s}
   @-webkit-keyframes ueb-dialog-fade-in{
      0%{
        -webkit-transform:translate3d(100%,0,0);
        transform:translate3d(100%,0,0);
        opacity:0
      }
      100%{-webkit-transform:translate3d(0,0,0);
        transform:translate3d(0,0,0);
        opacity:1
      }
    }
    @keyframes ueb-dialog-fade-in{
      0%{-webkit-transform:translate3d(100%,0,0);
        transform:translate3d(100%,0,0);
        opacity:0
      }
      100%{-webkit-transform:translate3d(0,0,0);
        transform:translate3d(0,0,0);
        opacity:1
      }
    }
    @-webkit-keyframes ueb-dialog-fade-out{
      0%{-webkit-transform:translate3d(0,0,0);
        transform:translate3d(0,0,0);
        opacity:1
      }
      100%{-webkit-transform:translate3d(100%,0,0);
        transform:translate3d(100%,0,0);
        opacity:0
      }
    }
    @keyframes ueb-dialog-fade-out{
      0%{-webkit-transform:translate3d(0,0,0);
        transform:translate3d(0,0,0);
        opacity:1
      }
      100%{
        -webkit-transform:translate3d(100%,0,0);
        transform:translate3d(100%,0,0);
        opacity:0
      }
    }
    /* @keyframes dialog-fade-in {
        0% {
            transform: translate3d(100%,0, 0);
            opacity: 0;
        }
        100% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
    }
    @keyframes dialog-fade-out {
        0% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
        100% {
            transform: translate3d(100%,0, 0);
            opacity: 0;
        }
    }    */
</style>