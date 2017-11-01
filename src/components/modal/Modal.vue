<template>
	<transition :name="animation">
		<div
      :class="['modal fade in', {show: isActive}]"
      :id="elementId" tabindex="-1"
      role="dialog"
      :aria-labelledby="labelledby"
      aria-hidden="true"
      ref="modal"
      key="modal"
      v-show="isActive"
      @click="onClickOut()"
      @keyup.esc="onEsc()">

			<div class="modal-dialog" :class="['modal-' + size]" @click.stop="">
				<div class="modal-content">
					<div v-if="!hideHeader" class="modal-header">
						<h4 :is="titleTag" class="modal-title">
              <slot name="modal-title">{{ title }}</slot>
            </h4>
					</div>

					<div class="modal-body" ref="body">
						<slot></slot>
					</div>
					<div class="modal-footer" ref="footer" v-if="!hideFooter">
            <slot name="modal-footer">
                <button type="button"
                      class="btn btn-primary btn-simple"
                      data-dismiss="modal"
                      @click="hide(false)">
                <slot name="modal-ok">Fechar</slot>
              </button>
            </slot>
          </div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
  let uid = 0

  export default {
    name: 'ElModal',
    props: {
      title: {
        type: String,
        default: ''
      },
      active: Boolean,
      animation: {
        type: String,
        default: 'zoom-out'
      },
      hideHeader: {
        type: Boolean,
        default: false
      },
      hideFooter: {
        type: Boolean,
        default: false
      },
      hideHeaderClose: {
        type: Boolean,
        default: false
      },
      titleTag: {
        type: String,
        default: 'h4'
      },
      closeTitle: {
        type: String,
        default: 'Fechar'
      },
      okTitle: {
        type: String,
        default: 'Entendi'
      },
      backdrop: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        validator: val => ['sm', 'lg'].includes(val)
      }
    },
    data () {
      uid += 1
      return {
        isActive: this.active || false,
        elementId: `el-modal-${uid}`
      }
    },
    computed: {
      labelledby () {
        return this.elementId
      },
      body () {
        if (typeof document !== 'undefined') {
          return document.body
        }
      }
    },
    beforeDestroy () {
      this.body.classList.remove('modal-open')
    },
    methods: {
      show () {
        if (this.isActive) return

        this.isActive = true

        this.$emit('show')
        this.body.classList.add('modal-open')
      },
      hide (isOk) {
        if (!this.isActive) return

        if (isOk === true) {
          this.$emit('ok')
        } else {
          this.$emit('cancel')
        }

        this.$emit('hide')
        this.isActive = false
        this.body.classList.remove('modal-open')
      },
      onClickOut () {
        if (this.isActive && !this.backdrop) {
          this.hide()
        }
      },
      onEsc () {
        if (this.isActive) {
          this.hide()
        }
      }
    },
    watch: {
      active (newValue, oldValue) {
        if (newValue === oldValue) return

        if (newValue) {
          this.show()
        } else {
          this.hide()
        }
      }
    }
  }
</script>

<style scoped>
    .hidden {
        opacity: 0 !important;
    }
    /* Make modal display as block instead of inline style, and because Vue's v-show deletes inline "display" style */
    .modal {
        display: block;
    }
</style>
